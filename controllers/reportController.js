const Shipment = require('../models/Shipment');

exports.getDashboardReport = async (req, res, next) => {
  try {
    const [totalShipments, delivered, inTransit, pending, revenueAgg, statusBreakdown, monthlyRevenue] =
      await Promise.all([
        Shipment.countDocuments(),
        Shipment.countDocuments({ status: 'delivered' }),
        Shipment.countDocuments({ status: 'in_transit' }),
        Shipment.countDocuments({ status: 'pending' }),
        Shipment.aggregate([
          { $group: { _id: null, total: { $sum: '$price' }, delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$price', 0] } } } },
        ]),
        Shipment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Shipment.aggregate([
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
              revenue: { $sum: '$price' },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 12 },
        ]),
      ]);

    const revenue = revenueAgg[0] || { total: 0, delivered: 0 };

    res.json({
      success: true,
      data: {
        summary: {
          totalShipments,
          delivered,
          inTransit,
          pending,
          cancelled: await Shipment.countDocuments({ status: 'cancelled' }),
          totalRevenue: revenue.total,
          deliveredRevenue: revenue.delivered,
        },
        statusBreakdown: statusBreakdown.map((s) => ({
          status: s._id,
          count: s.count,
        })),
        monthlyRevenue: monthlyRevenue.map((m) => ({
          month: m._id,
          revenue: m.revenue,
          shipments: m.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
