import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
import UserCoupon from "../models/UserCoupon.js";
import isValidArray from "../helpers/isValidArray.js";

const ALLOWED_TARGETS = ["accession", "monthlyFee", "installationPrice"];

export default class CouponController {
  static async create(req, res) {
    const { name, is_active, discountPercentage, target, users_ids } = req.body;

    try {
      if (!ALLOWED_TARGETS.includes(target)) {
        return res.status(400).json({
          message: `O campo 'target' deve ser um dos seguintes valores: ${ALLOWED_TARGETS.join(
            ", "
          )}.`,
        });
      }

      let validIds = [];
      try {
        validIds = await isValidArray(users_ids, User);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      const newCoupon = await Coupon.create({
        name: name.trim(),
        is_active,
        discountPercentage,
        target,
      });

      if (validIds.length > 0) {
        const values = validIds.map((userId) => ({
          user_id: userId,
          coupon_id: newCoupon.id,
        }));

        await UserCoupon.bulkCreate(values);
      }

      return res.status(201).json(newCoupon);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar o cupom.",
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    try {
      const coupons = await Coupon.findAll();
      return res.status(200).json({ coupons });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar cupons.",
        error: error.message,
      });
    }
  }

  static async removeCouponById(req, res) {
    const id = req.params.id;

    try {
      const couponById = await Coupon.findByPk(id);

      if (!couponById) {
        return res.status(404).json({ message: "Cupom não encontrado!" });
      }

      await Coupon.destroy({ where: { id } });
      return res.status(200).json({ message: "Cupom removido com sucesso!" });
    } catch (error) {
      return res.status(500).json({
        message: "Não foi possível remover o Cupom.",
        error: error.message,
      });
    }
  }

  static async updateCouponById(req, res) {
    const { id } = req.params;
    const { name, is_active, discountPercentage, target, users_ids } = req.body;

    try {
      if (!ALLOWED_TARGETS.includes(target)) {
        return res.status(400).json({
          message: `O campo 'target' deve ser um dos seguintes valores: ${ALLOWED_TARGETS.join(
            ", "
          )}.`,
        });
      }

      const coupon = await Coupon.findByPk(id);

      if (!coupon) {
        return res.status(404).json({ message: "Cupom não encontrado!" });
      }

      let validIds = [];
      try {
        validIds = await isValidArray(users_ids, User);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      coupon.name = name.trim();
      coupon.is_active = is_active;
      coupon.discountPercentage = discountPercentage;
      coupon.target = target;
      await coupon.save();

      await UserCoupon.destroy({ where: { coupon_id: id } });

      if (validIds.length > 0) {
        const values = validIds.map((userId) => ({
          user_id: userId,
          coupon_id: id,
        }));
        await UserCoupon.bulkCreate(values);
      }

      return res
        .status(200)
        .json({ message: "Cupom atualizado com sucesso!", coupon });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao atualizar o cupom.",
        error: error.message,
      });
    }
  }
}
