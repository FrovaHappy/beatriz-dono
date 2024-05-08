import { NextResponse, NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  const { image } = await req.json()
  const clientImgur = process.env.IMGUR_CLIENT
  if (!clientImgur) return NextResponse.json({ message: 'Not Imgur Client config' })
  const fd = new FormData()
  fd.append('image', image)
  fd.append('type', 'base64')
  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT}`
    },
    body: fd,
    redirect: 'follow'
  })
  const data = await response.json()
  return NextResponse.json(data)
}
