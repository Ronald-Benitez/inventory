
export const parseUrl = (url: string, replace: string) => {
  url = url.replace(replace, "");
  const urlArray = url.split("/");

  const arrayLength = urlArray.length;
  let orderBy = "";

  if (arrayLength === 5) {
    orderBy = urlArray[4];
  } else if (arrayLength === 3) {
    orderBy = urlArray[2];
  }

  const json = {
    skip: parseInt(urlArray[0]) || 0,
    take: parseInt(urlArray[1]),
    filterColumn: urlArray[2],
    filter: urlArray[3],
    filterIsString: verifyString(urlArray[3]),
    orderBy,
  };

  return json;
};

const verifyString = (value: string) => {
  try {
    const filterNumber = Number(value);

    if (filterNumber) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return true;
  }
};
