const provide_cell_types = (type) => {
    if(type === 'P') return ['Prokaryotic'];
    if(type === 'E') return ['Eukaryotic'];
    if(type === 'B') return ['Prokaryotic', 'Eukaryotic'];
    return [];
}

const provide_nutrition_types = (type) => {
    if(type === 'A') return ['Autotrophic'];
    if(type === 'H') return ['Heterotrophic'];
    if(type === 'M') return ['Autotrophic', 'Heterotrophic'];
    return [];
}

const provide_reproduction_types = (type) => {
    if(type === 'A') return ['Asexual'];
    if(type === 'S') return ['Sexual'];
    if(type === 'B') return ['Asexual', 'Sexual'];
    return [];
}

export {
    provide_cell_types,
    provide_nutrition_types,
    provide_reproduction_types
}