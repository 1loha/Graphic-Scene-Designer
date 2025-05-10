const verySmall = [0.05, 0.05, 0.05];
const small = [0.1, 0.1, 0.1];
const normal = [1, 1, 1];

let store = {
    _state: {
        createGrid: {
            displayName: 'Планировка',
            models: {
                createGrid: { label: 'Создать сетку' },
            },
        },
        furniture: {
            displayName: 'Мебель',
            models: {
                chair: { path: '/models/chair/scene.gltf', scale: normal },
                table: { path: '/models/table/scene.gltf', scale:  normal },
                sofa: { path: '/models/sofa/scene.gltf', scale: verySmall },
            },
        },
        sanitary: {
            displayName: 'Сантехника',
            models: {
                steve: { path: '/models/steve/source/model.gltf', scale: normal },
                bath: { path: '/models/bath_with_sink/scene.gltf', scale: normal },
                shower: { path: '/models/shower/scene.gltf', scale: normal },
            },
        },
        lighting: {
            displayName: 'Освещение',
            models: {
                lamp: { path: '/models/office_lamp/scene.gltf', scale: verySmall },
            },
        },
    },
    getState(){
        return this._state;
    },
}

export default store