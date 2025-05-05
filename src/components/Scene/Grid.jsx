import { Vector3, Plane } from 'three'
import { createContext, useRef, useContext, useCallback, useState } from 'react'
import { useThree } from '@react-three/fiber'

const v = new Vector3() // вспомогательный вектор для вычислений
const p = new Plane(new Vector3(0, 1, 0), 0) // плоскость для пересечений (Y=0)
const context = createContext() // Контекст для активации плоскости

// Управление событиями перетаскивания
function useDrag(onDrag) {
    const controls = useThree((state) => state.controls)
    const activatePlane = useContext(context)
    const [active, activate] = useState(false)

    // начало перетаскивания (блокирует управление камерой)
    const down = useCallback((e) => {
        e.stopPropagation()
        activate(true)
        activatePlane(true)
        if (controls) controls.enabled = false
        e.target.setPointerCapture(e.pointerId)
    }, [activatePlane, controls])

    // окончание перетаскивания
    const up = useCallback((e) => {
        activate(false)
        activatePlane(false)
        if (controls) controls.enabled = true
        e.target.releasePointerCapture(e.pointerId)
    }, [activatePlane, controls])

    // обработка перемещения
    const move = useCallback((e) => {
        e.stopPropagation()
        if (active && e.ray.intersectPlane(p, v)) onDrag(v)
    }, [onDrag, active])

    return [{
        onPointerDown: down,
        onPointerUp: up,
        onPointerMove: move
    }, active]
}

// создание сетки
function Grid({ children, gridScale, gridDivisions, ...props }) {
    // ссылки на DOM-элементы сетки и плоскости
    const grid = useRef()
    const plane = useRef()

    // отслеживание состояния активности
    const [_, activate] = useState(false)

    // создает сетку
    return (
        <group {...props}>
            <group scale={gridScale}>
                <gridHelper ref={grid} args={[1, gridDivisions, '#888', '#bbb']} />
                <mesh ref={plane} rotation-x={-Math.PI / 2}>
                    <planeGeometry />
                    <meshStandardMaterial visible={false} />
                </mesh>
            </group>
            <context.Provider value={activate}>
                {children}
            </context.Provider>
        </group>
    )
}

export { Grid, useDrag }
