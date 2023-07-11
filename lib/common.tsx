

// export const getFiletoBase64 = (file:any) => {
//     // console.log('file=======>',file)
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader?.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = error => reject(error);
//     })
// }
export function getFiletoBase64(file: Blob | File) {
    return new Promise((resolve, reject) => {
      console.log("File type:", typeof file, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
export const convertBase64toFile = async(url:string, name:string,type: string) => {
    // console.log('url========>',url)
    const res: Response = await fetch(`${url}`);
    // console.log('res=======>',res)
    const blob: Blob = await res.blob()
    return new File([blob], `${name}`, { type: type })
}
  
 