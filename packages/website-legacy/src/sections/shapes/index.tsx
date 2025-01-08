'use client'
import { useCanvasCtx } from '@/app/context'
import type { Icon, Image, Layer, Text } from '@/types/Canvas.types'
import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React, { useEffect, useState } from 'react'
import Shape from './Shape'
import style from './Shapes.module.scss'

export default function Shapes() {
  const [canvas, setCanvas] = useCanvasCtx()
  const [list, setList] = useState(canvas.layers)
  useEffect(() => {
    setList(canvas.layers)
  }, [canvas])
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setList(shape => {
        const oldIndex = shape.findIndex(person => person.id === active.id)
        const newIndex = shape.findIndex(person => person.id === over?.id)
        const listMoved = arrayMove(shape, oldIndex, newIndex)
        setCanvas({ ...canvas, layers: listMoved })
        return arrayMove(shape, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <ul className={style.content}>
        <SortableContext items={list} strategy={verticalListSortingStrategy}>
          {list.map(shape => {
            const title = () => {
              switch (shape.type) {
                case 'image':
                  shape = shape as Layer<Image>
                  return `${shape.width} x ${shape.height}`
                case 'icon':
                  shape = shape as Layer<Icon>
                  return shape.shape
                case 'text':
                  shape = shape as Layer<Text>
                  return shape.content
              }
            }
            const img = (shape as Layer<Image>).img ?? undefined
            return <Shape key={shape.id} id={shape.id} icon={shape.type} title={title()} image={img} />
          })}
        </SortableContext>
      </ul>
    </DndContext>
  )
}
