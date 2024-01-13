
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


export const getUrlData = (url: string, replace: string) => {
  url = url.replace(replace, "");
  const urlArray = url.split("/");

  const arrayLength = urlArray.length;
  let orderBy = "";

  if (arrayLength === 6) {
    orderBy = urlArray[5];
  } else if (arrayLength === 4) {
    orderBy = urlArray[3];
  }


  const json = {
    table: urlArray[0],
    skip: parseInt(urlArray[1]) || 0,
    take: parseInt(urlArray[2]),
    filterColumn: urlArray[3],
    filter: urlArray[4],
    filterIsString: verifyString(urlArray[5]),
    orderBy,
  };

  return json;
};