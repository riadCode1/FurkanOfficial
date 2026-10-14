export const isTrackSelected = (
  activeReciterId,
  activeChapterId,
  reciterId,
  chapterId
) => {
  const activeReciter = Number(activeReciterId);
  const activeChapter = Number(activeChapterId);
  const reciter = Number(reciterId);
  const chapter = Number(chapterId);

  return (
    Number.isFinite(activeReciter) &&
    Number.isFinite(activeChapter) &&
    activeReciter === reciter &&
    activeChapter === chapter
  );
};
