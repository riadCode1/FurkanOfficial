import { NewData } from "./NewData";
import { dataArray } from "./RecitersImages";

export const getReciterImage = (reciterId) => {
  const id = Number(reciterId);
  const customImage = NewData.recitations.find(
    (reciter) => reciter.id === id
  )?.image;

  return customImage || dataArray[id]?.image;
};
