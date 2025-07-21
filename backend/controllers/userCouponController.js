import UserCoupon from "../models/UserCoupon.js";

export default class UserCouponController {
  static async getUserByCouponId(req, res) {
    const id = req.params.id;

    try {
      const usersByCoupon = await UserCoupon.findAll({
        where: { coupon_id: id },
      });

      if (!usersByCoupon.length) {
        return res.status(404).json({
          message: "Nenhum usuário vinculado a este cupom.",
        });
      }

      const userIds = usersByCoupon.map((u) => u.user_id);

      return res.status(200).json(userIds);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao obter os usuários vinculados ao cupom.",
        error: error.message,
      });
    }
  }
}
