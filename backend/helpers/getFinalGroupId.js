import ProductGroup from '../models/ProductGroup.js'

const getFinalGroupId = async (product_group_id, group_name, req, res) => {
  let finalGroupId;

  if (product_group_id) {
    const existingGroup = await ProductGroup.findByPk(product_group_id);
    if (!existingGroup) {
      return res.status(400).json({
        message:
          "Grupo de produto não encontrado, por favor crie um Grupo de Produtos!",
      });
    }
    finalGroupId = product_group_id;
  } else if (group_name && group_name.trim()) {
    const groupExists = await ProductGroup.findOne({
      where: { name: group_name.trim() },
    });
    if (groupExists) {
      return res.status(400).json({
        message: "Grupo de produto já criado, por favor utilize outro nome!",
      });
    }

    const newGroup = await ProductGroup.create({ name: group_name.trim() });
    finalGroupId = newGroup.id;
  } else {
    finalGroupId = null;
  }

  return finalGroupId;
};

export default getFinalGroupId;
