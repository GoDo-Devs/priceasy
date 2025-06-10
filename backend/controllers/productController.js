import Product from "../models/Product.js";
import ProductVehicleType from "../models/ProductVehicleType.js";
import VehicleType from "../models/VehicleType.js";
import isValidArray from "../helpers/isValidArray.js";
import getFinalGroupId from "../helpers/getFinalGroupId.js";

export default class ProductController {
  static async create(req, res) {
    const { name, price, product_group_id, group_name, vehicle_type_ids } =
      req.body;

    const productExists = await Product.findOne({ where: { name } });

    if (productExists) {
      return res.status(422).json({
        message: "Produto já cadastrado, por favor utilize outro nome!",
      });
    }

    const finalGroupId = await getFinalGroupId(
      product_group_id,
      group_name,
      req,
      res
    );

    try {
      const validIds = await isValidArray(
        vehicle_type_ids,
        VehicleType,
        req,
        res
      );

      const newProduct = await Product.create({
        name: name.trim(),
        price: Number(price),
        product_group_id: finalGroupId,
      });

      if (validIds.length > 0) {
        const values = validIds.map((typeId) => ({
          vehicle_type_id: typeId,
          product_id: newProduct.id,
        }));

        await ProductVehicleType.bulkCreate(values);
      }

      return res.status(200).json({
        message: "Produto criado com sucesso!",
        product: newProduct,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao criar o Produto.",
        error: error.message,
      });
    }
  }

  static async getAll(req, res) {
    const products = await Product.findAll();

    try {
      res.status(200).json({ products: products });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar grupos.", error: error.message });
    }
  }

  static async getProductById(req, res) {
    const id = req.params.id;

    const productById = await Product.findByPk(id);

    if (!productById) {
      res.status(404).json({ message: "Produto não encontrado!" });
      return;
    }

    try {
      const product = await Product.findByPk(id);
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ message: "Produto não encontrado!" });
      return;
    }
  }

  static async removeProductById(req, res) {
    const id = req.params.id;

    const productById = await Product.findByPk(id);

    if (!productById) {
      res.status(404).json({ message: "Produto não encontrado!" });
      return;
    }

    try {
      await Product.destroy({ where: { id: id } });
      res.status(200).json({ message: "Produto removido com sucesso!" });
      return;
    } catch (error) {
      res.status(404).json({ message: "Produto não encontrado!" });
      return;
    }
  }

  static async updateProductById(req, res) {
    const id = req.params.id;
    const { name, price, product_group_id, group_name, vehicle_type_ids } =
      req.body;
    const productById = await Product.findByPk(id);

    if (!productById) {
      res.status(404).json({ message: "Produto não encontrado!" });
      return;
    }

    const finalGroupId = await getFinalGroupId(
      product_group_id,
      group_name,
      req,
      res
    );

    try {
      const validIds = await isValidArray(
        vehicle_type_ids,
        VehicleType,
        req,
        res
      );

      const productUpdate = await Product.update(
        {
          name: name.trim(),
          price: Number(price),
          product_group_id: finalGroupId,
        },
        {
          where: { id },
        }
      );

      await ProductVehicleType.destroy({
        where: { product_id: id },
      });

      if (validIds.length > 0) {
        const values = validIds.map((typeId) => ({
          vehicle_type_id: typeId,
          product_id: id,
        }));

        await ProductVehicleType.bulkCreate(values);
      }

      return res.status(200).json({
        message: "Produto atualizado com sucesso!",
        product: {
          id,
          name,
          price,
          product_group_id: finalGroupId,
          vehicle_type_ids: validIds,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao atualizar o Produto.",
        error: error.message,
      });
    }
  }
}
