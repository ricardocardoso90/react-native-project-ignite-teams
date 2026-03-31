import { groupsGetAll } from "./groupsGetAll";

import { AppError } from "@utils/AppError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "@storage/storageConfig";

export async function groupCreate(newGroup: string) {
  try {

    const storedGroups = await groupsGetAll();
    const groupAlreadExists = storedGroups.includes(newGroup);

    if (groupAlreadExists) {
      throw new AppError('Já existe um grupo cadastrado com esse nome.');
    }

    const storage = JSON.stringify([...storedGroups, newGroup])
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);

  } catch (error) {
    throw error;
  }
};