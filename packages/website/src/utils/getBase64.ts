export default async function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = error => {
      console.error(error)
      reject(null)
    }
  })
}
