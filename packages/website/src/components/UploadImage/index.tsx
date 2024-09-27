import type { InputExport } from '@/types/types'
import IconPencil from '@icons/IconPencil'
import IconTrash from '@icons/IconTrash'
import { useEffect, useState } from 'react'
import style from './index.module.scss'
import useStatus from './useStatusUpload'

const TYPE_OF = 'image/png, image/jpeg'

type Url = string | undefined
interface Props {
  defaultValue: Url
  width?: `${number}px` | `${number}rem`
}
interface WithUrlProps {
  url: string
  width?: `${number}px` | `${number}rem`
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setUrl: (value: string | undefined) => void
}
function WithUrl({ url, onChange, width, setUrl }: WithUrlProps) {
  return (
    <div className={style.withUrl} style={{ width }}>
      <img src={url} alt='upload' className={style.withUrl__img} />
      <input id={style.file} type='file' maxLength={1} onChange={onChange} />
      <label htmlFor={style.file} className={style.withUrl__edit} typeof={TYPE_OF}>
        <IconPencil />
      </label>
      <button
        type='button'
        className={style.withUrl__delete}
        onClick={() => {
          setUrl(undefined)
        }}
      >
        <IconTrash />
      </button>
    </div>
  )
}

function EmptyUrl({ onChange }: Omit<WithUrlProps, 'url' | 'setUrl'>) {
  return (
    <>
      <input id={style.file} type='file' maxLength={1} onChange={onChange} />
      <label htmlFor={style.file} className={style.emptyUrl} typeof={TYPE_OF}>
        <IconPencil className={style.emptyUrl__icon} />
        Haz click para agregar una imagen.
      </label>
    </>
  )
}

export default function UploadImage({ defaultValue, width }: Props): InputExport<Url> {
  const [url, setUrl] = useState(defaultValue)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useStatus(setUrl, file)

  useEffect(() => {
    setUrl(defaultValue)
  }, [defaultValue])
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = e.target.files
    if (!files) {
      setUrl(undefined)
      return
    }
    setFile(files[0])
  }

  /** Error Component */
  useEffect(() => {
    if (status !== 'error') return
    setTimeout(() => {
      setStatus('finished')
    }, 5000)
  }, [status])
  if (status === 'error') {
    const Component = (
      <div className={style.error}>
        <span />
        <p>A ocurrido un error</p>
        <div className={style.error__line} />
      </div>
    )
    return [url, Component]
  }

  /** Loading Component */
  if (status === 'uploading') {
    const Component = (
      <div className={style.loading}>
        <span />
        <p>Subiendo archivo</p>
        <div className={style.loading__line} />
      </div>
    )
    return [url, Component]
  }

  const Component = (
    <div>
      {(() => {
        switch (typeof url) {
          case 'string':
            return <WithUrl url={url} onChange={onChange} width={width} setUrl={setUrl} />
          default:
            return <EmptyUrl onChange={onChange} />
        }
      })()}
    </div>
  )
  return [url, Component]
}
