const Sales = require('../models/Sales');

class SalesService {
  buildQuery(filters) {
    const query = {};
    const conditions = [];
    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      conditions.push({
        $or: [
          { cname: searchRegex },
          { phone: searchRegex }
        ]
      });
    }

    if (filters.region && filters.region.length > 0) {
      conditions.push({ region: { $in: filters.region } });
    }

    if (filters.gender && filters.gender.length > 0) {
      conditions.push({ gender: { $in: filters.gender } });
    }

    if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
      const ageCondition = {};
      if (filters.ageMin !== undefined) ageCondition.$gte = parseInt(filters.ageMin);
      if (filters.ageMax !== undefined) ageCondition.$lte = parseInt(filters.ageMax);
      conditions.push({ age: ageCondition });
    }

    if (filters.category && filters.category.length > 0) {
      conditions.push({ category: { $in: filters.category } });
    }

    if (filters.tags && filters.tags.length > 0) {
      conditions.push({ tags: { $in: filters.tags } });
    }

    if (filters.payment && filters.payment.length > 0) {
      conditions.push({ payment: { $in: filters.payment } });
    }

    if (filters.dateFrom || filters.dateTo) {
      const dateCondition = {};
      if (filters.dateFrom) {
        dateCondition.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59, 999);
        dateCondition.$lte = dateTo;
      }
      conditions.push({ date: dateCondition });
    }

    if (conditions.length > 0) {
      query.$and = conditions;
    }

    return query;
  }

  buildSort(sortBy) {
    const sortMap = {
      'tid-asc': { tid: 1 },
      'tid-desc': { tid: -1 },
      'date-desc': { date: -1 },
      'date-asc': { date: 1 },
      'quantity-desc': { qty: -1 },
      'quantity-asc': { qty: 1 },
      'name-asc': { cname: 1 },
      'name-desc': { cname: -1 }
    };

    return sortMap[sortBy] || { tid: 1 };
  }


  async getSales(options) {
    const {
      search,
      filters = {},
      sortBy = 'date-desc',
      page = 1,
      limit = 10
    } = options;

    const query = this.buildQuery({ search, ...filters });
    const sort = this.buildSort(sortBy);
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        Sales.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Sales.countDocuments(query)
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch sales: ${error.message}`);
    }
  }


  async getFilterOptions() {
    try {
      const [
        regions,
        genders,
        categories,
        tags,
        paymentMethods
      ] = await Promise.all([
        Sales.distinct('region'),
        Sales.distinct('gender'),
        Sales.distinct('category'),
        Sales.distinct('tags'),
        Sales.distinct('payment')
      ]);

      return {
        region: regions.sort(),
        gender: genders.sort(),
        category: categories.sort(),
        tags: tags.sort(),
        payment: paymentMethods.sort()
      };
    } catch (error) {
      throw new Error(`Failed to fetch filter options: ${error.message}`);
    }
  }


  async getStatistics(filters = {}) {
    const query = this.buildQuery(filters);

    try {
      const stats = await Sales.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalUnits: { $sum: '$qty' },
            totalAmount: { $sum: '$total' },
            totalDiscount: { $sum: { $multiply: ['$total', { $divide: ['$discount', 100] }] } },
            count: { $sum: 1 }
          }
        }
      ]);

      if (stats.length === 0) {
        return {
          totalUnits: 0,
          totalAmount: 0,
          totalDiscount: 0,
          totalRecords: 0
        };
      }

      return {
        totalUnits: stats[0].totalUnits,
        totalAmount: stats[0].totalAmount,
        totalDiscount: stats[0].totalDiscount,
        totalRecords: stats[0].count
      };
    } catch (error) {
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }

 
  async getAgeRange() {
    try {
      const result = await Sales.aggregate([
        {
          $group: {
            _id: null,
            minAge: { $min: '$age' },
            maxAge: { $max: '$age' }
          }
        }
      ]);

      return result.length > 0 
        ? { min: result[0].minAge, max: result[0].maxAge }
        : { min: 0, max: 100 };
    } catch (error) {
      throw new Error(`Failed to fetch age range: ${error.message}`);
    }
  }
}

module.exports = new SalesService();