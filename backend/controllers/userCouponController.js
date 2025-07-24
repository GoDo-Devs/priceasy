import UserCoupon from "../models/UserCoupon.js";
import Coupon from "../models/Coupon.js";

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

  static async getAllCouponsByUserIdAndTarget(req, res) {
    const { userId, target, is_active } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Campo 'userId' obrigatório." });
    }

    try {
      const userCoupons = await UserCoupon.findAll({
        where: { user_id: userId },
        attributes: ["coupon_id"],
      });

      if (userCoupons.length === 0) {
        return res.status(200).json({ coupons: [] });
      }

      const couponIds = userCoupons.map((uc) => uc.coupon_id);

      const coupons = await Coupon.findAll({
        where: {
          id: couponIds,
          ...(target ? { target } : {}),
          ...(is_active !== undefined ? { is_active } : {}),
        },
      });

      return res.status(200).json({ coupons });
    } catch (error) {
      console.error("Erro:", error);
      return res.status(500).json({
        message: "Erro ao buscar cupons do usuário com target.",
        error: error.message,
      });
    }
  }
}
