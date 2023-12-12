export const parseUrl = (url: string, replace: string) => {
    url = url.replace(replace, "");
    const urlArray = url.split("/");
    const json = {
        skip: parseInt(urlArray[0]) || 0,
        take: parseInt(urlArray[1]),
    };
    return json;
}