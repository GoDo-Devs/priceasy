const isValidArray = async (data, model) => {
  if (data && Array.isArray(data)) {
    const validData = await model.findAll({
      where: { id: data },
      attributes: ["id"],
    });

    const validIds = validData.map((vd) => vd.id);
    const invalidIds = data.filter((id) => !validIds.includes(id));

    if (invalidIds.length > 0) {
      throw new Error(`Ids inválidos: ${invalidIds.join(", ")}`);
    }

    return validIds;
  }

  return [];
};

export default isValidArray;
