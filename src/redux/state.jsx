const xxxs = [0.01, 0.01, 0.01];
const xxs = [0.05, 0.05, 0.05];
const xs = [0.1, 0.1, 0.1];
const s = [0.5, 0.5, 0.5];
const m = [1, 1, 1];
const l = [2, 2, 2];


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
                chair: { path: '/models/chair/scene.gltf', scale: s },
                table: { path: '/models/table/scene.gltf', scale:  m },
                sofa: { path: '/models/sofa/scene.gltf', scale: xs },
            },
        },
        sanitary: {
            displayName: 'Сантехника',
            models: {
                steve: { path: '/models/steve/source/model.gltf', scale: m },
                bath: { path: '/models/bath_with_sink/scene.gltf', scale: l },
                shower: { path: '/models/shower/scene.gltf', scale: xxxs },
            },
        },
        lighting: {
            displayName: 'Освещение',
            models: {
                lamp: { path: '/models/office_lamp/scene.gltf', scale: xs },
            },
        },
    },
    getState(){
        return this._state;
    },
}

export default store