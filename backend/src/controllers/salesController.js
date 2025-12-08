const salesService = require('../services/salesService');

class SalesController {
  async getSales(req, res) {
    try {
      const {
        search,
        region,
        gender,
        ageMin,
        ageMax,
        category,
        tags,
        payment,
        dateFrom,
        dateTo,
        sortBy = 'date-desc',
        page = 1,
        limit = 10
      } = req.query;

      const filters = {
        region: region ? (Array.isArray(region) ? region : [region]) : undefined,
        gender: gender ? (Array.isArray(gender) ? gender : [gender]) : undefined,
        category: category ? (Array.isArray(category) ? category : [category]) : undefined,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
        payment: payment ? (Array.isArray(payment) ? payment : [payment]) : undefined,
        ageMin: ageMin ? parseInt(ageMin) : undefined,
        ageMax: ageMax ? parseInt(ageMax) : undefined,
        dateFrom,
        dateTo
      };

      Object.keys(filters).forEach(key => 
        filters[key] === undefined && delete filters[key]
      );

      const result = await salesService.getSales({
        search,
        filters,
        sortBy,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      console.error('Error in getSales:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getFilterOptions(req, res) {
    try {
      const options = await salesService.getFilterOptions();
      
      res.json({
        success: true,
        data: options
      });
    } catch (error) {
      console.error('Error in getFilterOptions:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  async getStatistics(req, res) {
    try {
      const {
        search,
        region,
        gender,
        ageMin,
        ageMax,
        category,
        tags,
        payment,
        dateFrom,
        dateTo
      } = req.query;

      const filters = {
        search,
        region: region ? (Array.isArray(region) ? region : [region]) : undefined,
        gender: gender ? (Array.isArray(gender) ? gender : [gender]) : undefined,
        category: category ? (Array.isArray(category) ? category : [category]) : undefined,
        tags: tags ? (Array.isArray(tags) ? tags : [tags]) : undefined,
        payment: payment ? (Array.isArray(payment) ? payment : [payment]) : undefined,
        ageMin: ageMin ? parseInt(ageMin) : undefined,
        ageMax: ageMax ? parseInt(ageMax) : undefined,
        dateFrom,
        dateTo
      };
      Object.keys(filters).forEach(key => 
        filters[key] === undefined && delete filters[key]
      );

      const stats = await salesService.getStatistics(filters);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getStatistics:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAgeRange(req, res) {
    try {
      const range = await salesService.getAgeRange();
      
      res.json({
        success: true,
        data: range
      });
    } catch (error) {
      console.error('Error in getAgeRange:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new SalesController();