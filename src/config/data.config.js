const provide_cell_types = (type) => {
    if(type === 'P') return ['Nhân sơ']; /// Prokaryotic
    if(type === 'E') return ['Nhân thực']; // Eukaryotic
    if(type === 'B') return ['Nhân sơ', 'Nhân thực']; // Hỗn hợp
    return [];
}

const provide_nutrition_types = (type) => {
    if(type === 'A') return ['Tự dưỡng']; // Autotrophic
    if(type === 'H') return ['Ký sinh']; // Heterotrophic
    if(type === 'M') return ['Tự dưỡng', 'Ký sinh']; // Hỗn hợp
    return [];
}

const provide_reproduction_types = (type) => {
    if(type === 'A') return ['Vô tính']; // Asexual
    if(type === 'S') return ['Hữu tính']; // Sexual
    if(type === 'B') return ['Vô tính', 'Hữu tính']; // Hỗn hợp
    return [];
}

export {
    provide_cell_types,
    provide_nutrition_types,
    provide_reproduction_types
}