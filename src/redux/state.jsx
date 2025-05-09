
let store = {
    _state: {
        furniture: {
            displayName: 'Мебель',
            models: {
                chair: { path: '/models/chair/scene.gltf', scale: [1, 1, 1] },
                table: { path: '/models/table/scene.gltf', scale: [1, 1, 1] },
                sofa: { path: '/models/sofa/scene.gltf', scale: [0.05, 0.05, 0.05] },
            },
        },
        sanitary: {
            displayName: 'Сантехника',
            models: {
                steve: { path: '/models/steve/source/model.gltf', scale: [1, 1, 1] },
                bath: { path: '/models/bath_with_sink/scene.gltf', scale: [1, 1, 1] },
                shower: { path: '/models/shower/scene.gltf', scale: [1, 1, 1] },
            },
        },
        lighting: {
            displayName: 'Освещение',
            models: {
                lamp: { path: 'public/models/office_lamp/scene.gltf', scale: [1, 1, 1] },
            },
        },
    },
    getState(){
        return this._state;
    },
}

export default store