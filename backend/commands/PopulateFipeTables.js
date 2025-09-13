import FipeToDatabaseService from "../services/FipeToDatabaseService.js";

async function PopulateFipeTables() {
  await new FipeToDatabaseService().exec();
}

PopulateFipeTables().catch(console.error);
