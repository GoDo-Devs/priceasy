const isValidArray = async (data, model, req, res) => {
  if (data && Array.isArray(data)) {
    const validData = await model.findAll({
      where: { id: data },
      attributes: ["id"],
    });

    const validIds = validData.map((vd) => vd.id);
    const invalidIds = data.filter((id) => !validIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        message: `Tipos de veículo inválidos`,
      });
    }

    return validIds;
  }

  return [];
};

export default isValidArray;
