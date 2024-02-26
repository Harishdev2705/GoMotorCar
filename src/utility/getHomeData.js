const service = require("../services/mongodb.services");

exports.getHomeData =async (modal,startdate,enddate,id) => {

    const unitss = await service.findManyForAwait(modal, { userId: id, createdAt: { $gte: startdate, $lt: enddate } }, {});

    const unitsByData = {};
    unitss.forEach(unit => {
        const data = unit.createdAt.getMonth();
        if (!unitsByData[data]) {
            unitsByData[data] = 0;
        }
        unitsByData[data] += unit.totalUsgaesInKW;
    });

    // Calculate the monthly average units
    const Data = Object.keys(unitsByData).length;
    const totalUnits = Object.values(unitsByData).reduce((acc, val) => acc + val, 0);
    const averageValue = totalUnits / Data;
        // 1kwh = 0.10089343 Ngn
    const ngnValue = (averageValue)*0.10089343
    return {averageValue,ngnValue}
};

exports.getDailyAvgData = async(modal,date,id) =>{

    const unitsss = await service.findOneForAwait(modal, {
        userId: id,
        $expr: {
            $and: [
                { $eq: [{ $dayOfMonth: '$createdAt' }, { $dayOfMonth: date }] },
                { $eq: [{ $month: '$createdAt' }, { $month: date }] },
                { $eq: [{ $year: '$createdAt' }, { $year: date }] }
            ]
        }
    }, {});
    const dailyAvgUnits = unitsss ? unitsss.totalUsgaesInKW : null;
    const ngnValue = dailyAvgUnits*0.10089343
    return {dailyAvgUnits,ngnValue}
}

exports.totalUnits = async (modal,id) =>{
    const units = await service.findManyForAwait(modal, { userId: id }, {});
    const totalAmount = units.reduce((sum, unit) => sum + unit.totalUsgaesInKW, 0);

        const totalUnitUsed = units ? totalAmount : null
        const ngnValue = totalUnitUsed*0.10089343
        return {
            totalUnitUsed,
            ngnValue
        }
}