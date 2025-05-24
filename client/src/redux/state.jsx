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
                createGrid: { label: 'Создать планировку' },
            },
        },
        furniture: {
            displayName: 'Мебель',
            models: {
                chair: { label: 'Стул', path: '/models/chair/scene.gltf', scale: s },
                table: { label: 'Стол', path: '/models/table/scene.gltf', scale: m },
                sofa: { label: 'Диван', path: '/models/sofa/scene.gltf', scale: xs },
            },
        },
        sanitary: {
            displayName: 'Сантехника',
            models: {
                steve: { label: 'Стив', path: '/models/steve/source/model.gltf', scale: m },
                bath: { label: 'Ванна', path: '/models/bath_with_sink/scene.gltf', scale: l },
                shower: { label: 'Душ', path: '/models/shower/scene.gltf', scale: xxxs },
            },
        },
        lighting: {
            displayName: 'Освещение',
            models: {
                lamp: { label: 'Лампа', path: '/models/office_lamp/scene.gltf', scale: xs },
            },
        },
        kitchen: {
            displayName: 'Кухня',
            models: {
                steve: { label: 'Стив', path: '/models/steve/source/model.gltf', scale: m },
            },
        },
        appliances: {
            displayName: 'Техника',
            models: {
                steve: { label: 'Стив', path: '/models/steve/source/model.gltf', scale: m },
            },
        },
        livingRoom: {
            displayName: 'Гостиная',
            models: {
                steve: { label: 'Стив', path: '/models/steve/source/model.gltf', scale: m },
            },
        },
        childrenRoom: {
            displayName: 'Детская',
            models: {
                steve: { label: 'Стив', path: '/models/steve/source/model.gltf', scale: m },
            },
        },
        hallway: {
            displayName: 'Прихожая',
            models: {
                steve: { label: 'Стив', path: '/models/steve/source/model.gltf', scale: m },
            },
        },
        decorations: {
            displayName: 'Декорации',
            models: {
                steve: { label: 'Стив', path: '/models/steve/source/model.gltf', scale: m },
            },
        },
        imported: {
            displayName: 'Добавленные',
            models: {
            },
        },

    },
    getState() {
        return this._state;
    },
};

export default store;