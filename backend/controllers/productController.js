import Product from "../models/Product.js";
import getFinalGroupId from "../helpers/getFinalGroupId.js";

export default class ProductController {
  static async create(req, res) {
    const { name, price, product_group_id, group_name } = req.body;

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
      const newProduct = await Product.create({
        name: name.trim(),
        price: Number(price),
        product_group_id: finalGroupId,
      });

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
      res.status(200).json({
        product,
      });
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
      res.status(404).json({ message: "Produto removido com sucesso!" });
      return;
    } catch (error) {
      res.status(404).json({ message: "Produto não encontrado!" });
      return;
    }
  }

  static async updateProductById(req, res) {
    const id = req.params.id;
    const { name, price, product_group_id, group_name } = req.body;
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

      if (productUpdate[0] === 0) {
        return res
          .status(400)
          .json({ message: "Nenhuma alteração foi feita." });
      }

      return res.status(200).json({
        message: "Produto atualizado com sucesso!",
        product: productUpdate,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao atualizar o Produto.",
        error: error.message,
      });
    }
  }
}
