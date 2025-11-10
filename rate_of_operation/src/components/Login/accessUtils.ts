export const hasValidAccess = (user: any): boolean => {
    if (!user) return false;

    const requiredGroups = [
        "Azure_KC_ProdRate_Access_Prod",
        "Azure_KC_ProdRate_Access_NonProd",
    ];
    const requiredRegions = ["Azure_KC_ProdRate_Region_KCNA"];

    const hasRegion = user.myregion?.some((region: string) =>
        requiredRegions.includes(region)
    );
    const hasGroup = user.mygroup?.some((group: string) =>
        requiredGroups.includes(group)
    );

    return hasRegion && hasGroup;
};

export const isAdminUser = (user: any): boolean => {
    return user.myrole?.some((role: string) =>
        ["Azure_KC_ProdRate_Role_Admin"].includes(role)
    );
};
