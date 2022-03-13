import {getSession} from "next-auth/react";
import Connection from "../../../config/dbConnection";
import Diary from "../../../models/Diary";
import Record from "../../../models/Record";
import {DateTime} from "luxon";


const getRecords = async(req,res) => {
    if (req.method !== 'POST') {
        return req.status(401).json({
           data:undefined,
            type:'error',
            message:'Only GET method is allowed'
        });
    }

    try{
        const {diaryId,userId,analysis} = req.body;
        const session = await getSession(res);

        if (userId !== session.user.id) {
            return res.status(401).json({
                data:undefined,
                type:'error',
                message:'Unauthorized'
            });
        }

        await Connection();

        const diary = await Diary.find({
            userId:userId,
            _id:diaryId
        });

        if (diary.length === 0) {
            return res.status(401).json({
                data:undefined,
                type:'error',
                message:'Diary does not exist'
            });
        }

        const records = await Record.find({
            diaryId:diaryId
        }).select('-backBodyImage -frontBodyImage');

        if(analysis) {
            const analysis = analysisCalculation(records);
            console.log(analysis);
            return res.status(200).json({
                data:{
                    diary:diary,
                    records:records,
                    analysis:analysis
                },
                type:'',
                message:'Success'
            });
        }else{
            return res.status(200).json({
                data:{
                    diary:diary,
                    records:records
                },
                type:'',
                message:'Success'
            });
        }

    }catch (error){
        console.log(error);
        return res.status(500).json({
            data:undefined,
            type:'error',
            message:'Only GET method is allowed'
        })
    }
}

export default getRecords;


const analysisCalculation = (records) => {
    //AveragePainLevel
    const lastWeek = DateTime.now().minus({weeks:1}).startOf('week');
    const thisWeek = DateTime.now().startOf('week');
    const endOfThisWeek = DateTime.now().endOf('week').plus({seconds:1});
    let averageValueLastWeek = 0;
    let lastWeekCount = 0;
    let averageValueThisWeek = 0;
    let thisWeekCount = 0;

    //Average by time
    const twelveAm = DateTime.fromFormat('00:00','HH:mm');
    const sixAm = DateTime.fromFormat('06:00','HH:mm');
    const twelvePm = DateTime.fromFormat('12:00','HH:mm');
    const sixPm = DateTime.fromFormat('18:00','HH:mm');
    let averagePainTwelveAmToSixAm = 0;
    let averagePainSixAmToTwelvePm = 0;
    let averagePainTwelvePmToSixPm =0;
    let averagePainSixPmToTwelveAm =0;
    let averagePainTwelveAmToSixAmCount = 0;
    let averagePainSixAmToTwelvePmCount = 0;
    let averagePainTwelvePmToSixPmCount =0;
    let averagePainSixPmToTwelveAmCount =0;

    //Average by sleep
    let averageLessThanSix = 0;
    let averageSixToEight = 0;
    let averageMoreThanEight = 0;
    let averageLessThanSixCount = 0;
    let averageSixToEightCount = 0;
    let averageMoreThanEightCount = 0;

    //Average Pain Level by Area
    let uniqueAreas = [];

    for (const record of records){
        //Average Pain
        if(record.recordStartDate >= lastWeek && record.recordEndDate <= thisWeek){
            averageValueLastWeek += record.painLevel;
            lastWeekCount++;
        }else if (record.recordStartDate >= thisWeek && record.recordEndDate <= endOfThisWeek) {
            averageValueThisWeek += record.painLevel;
            thisWeekCount++;
        }
        //Average Pain by Time
        if(DateTime.fromISO(record.recordStartDate).startOf('hour') >= twelveAm &&
        DateTime.fromISO(record.recordEndDate).startOf('hour') <= sixAm){
            averagePainTwelveAmToSixAm += record.painLevel;
            averagePainTwelveAmToSixAmCount++;
        }else if (DateTime.fromISO(record.recordStartDate).startOf('hour') >= sixAm &&
        DateTime.fromISO(record.recordEndDate).startOf('hour') <= twelvePm) {
            averagePainSixAmToTwelvePm += record.painLevel;
            averagePainSixAmToTwelvePmCount++;
        }else if(DateTime.fromISO(record.recordStartDate).startOf('hour') >= twelvePm &&
        DateTime.fromISO(record.recordEndDate).startOf('hour') <= sixPm) {
            averagePainTwelvePmToSixPm += record.painLevel;
            averagePainTwelvePmToSixPmCount++;
        }else if(DateTime.fromISO(record.recordStartDate).startOf('hour') >= sixPm &&
        DateTime.fromISO(record.recordEndDate).startOf('hour') <= twelveAm) {
            averagePainSixPmToTwelveAm += record.painLevel;
            averagePainSixPmToTwelveAmCount++;
        }else{
            averagePainTwelveAmToSixAm += record.painLevel;
            averagePainTwelveAmToSixAmCount++;
            averagePainSixAmToTwelvePm += record.painLevel;
            averagePainSixAmToTwelvePmCount++;
            averagePainTwelvePmToSixPm += record.painLevel;
            averagePainTwelvePmToSixPmCount++;
            averagePainSixPmToTwelveAm += record.painLevel;
            averagePainSixPmToTwelveAmCount++;
        }

        //Average by sleep
        if(!record.sleep.hours && record.sleep.minutes) {
            averageLessThanSix += record.painLevel;
            averageLessThanSixCount++;
        }else if (parseInt(record.sleep.hours) < 6) {
            averageLessThanSix += record.painLevel;
            averageLessThanSixCount++;
        }else if(parseInt(record.sleep.hours) >= 6 && parseInt(record.sleep.hours) <= 8){
            averageSixToEight += record.painLevel;
            averageSixToEightCount++;
        }else if (parseInt(record.sleep.hours) > 8) {
            averageMoreThanEight += record.painLevel;
            averageMoreThanEightCount++;
        }

        //Average Pain by Area
        for(const area of record.areas){
            let found = false;
            for(const uniqueArea of uniqueAreas) {
                if(area.name === uniqueArea.name){
                    found = true;
                    uniqueArea.painLevel = uniqueArea.painLevel + record.painLevel;
                    uniqueArea.count = uniqueArea.count + 1;
                    break;
                }
            }
            if (!found) {
                uniqueAreas.push({
                    name: area.name,
                    painLevel:record.painLevel,
                    count:1,
                    average:0
                })
            }
        }

    }
    //Average Pain Level
    if(averageValueLastWeek !== 0) {
        averageValueLastWeek = averageValueLastWeek / lastWeekCount;
        averageValueLastWeek = Math.round((averageValueLastWeek + Number.EPSILON) * 100) / 100;
    }
    if(averageValueThisWeek !== 0) {
        averageValueThisWeek = averageValueThisWeek / thisWeekCount;
        averageValueThisWeek = Math.round((averageValueThisWeek + Number.EPSILON) * 100) / 100;
    }
    const percentage = Math.round((averageValueThisWeek - averageValueLastWeek) / averageValueLastWeek * 100);

    //Average Pain Level by Time
    averagePainTwelveAmToSixAm = averagePainTwelveAmToSixAm / averagePainTwelveAmToSixAmCount;
    averagePainTwelveAmToSixAm = Math.round((averagePainTwelveAmToSixAm + Number.EPSILON) * 100) / 100;

    averagePainSixAmToTwelvePm = averagePainSixAmToTwelvePm / averagePainSixAmToTwelvePmCount;
    averagePainSixAmToTwelvePm = Math.round((averagePainSixAmToTwelvePm + Number.EPSILON) * 100) / 100;

    averagePainTwelvePmToSixPm = averagePainTwelvePmToSixPm / averagePainTwelvePmToSixPmCount;
    averagePainTwelvePmToSixPm = Math.round((averagePainTwelvePmToSixPm + Number.EPSILON) * 100) / 100;

    averagePainSixPmToTwelveAm = averagePainSixPmToTwelveAm / averagePainSixPmToTwelveAmCount;
    averagePainSixPmToTwelveAm = Math.round((averagePainSixPmToTwelveAm + Number.EPSILON) * 100) / 100;

    //Average Pain Level by Sleep
    if(averageLessThanSix !== 0) {
        averageLessThanSix = averageLessThanSix / averageLessThanSixCount;
        averageLessThanSix = Math.round((averageLessThanSix + Number.EPSILON) * 100) / 100;
    }
    if(averageSixToEight !== 0) {
        averageSixToEight = averageSixToEight / averageSixToEightCount;
        averageSixToEight = Math.round((averageSixToEight + Number.EPSILON) * 100) / 100;
    }
    if(averageMoreThanEight !== 0) {
        averageMoreThanEight = averageMoreThanEight / averageMoreThanEightCount;
        averageMoreThanEight = Math.round((averageMoreThanEight + Number.EPSILON) * 100) / 100;
    }

    //Average Pain Level by Area
    for(const area of uniqueAreas) {
        area.average = Math.round((area.painLevel / area.count + Number.EPSILON) * 100) / 100;
    }
    console.log(uniqueAreas);

    uniqueAreas.sort(compareAreaAverage);

    const areaResult = uniqueAreas.slice(0,3);

    return {
        avgPainLevel:{
                lastWeek: averageValueLastWeek,
                thisWeek: averageValueThisWeek,
                percentage: percentage,
                thisWeekColor: percentage < 0 ? '#87A878' : '#F95B3D',
                lastWeekColor: averageValueLastWeek < 3 ? averageValueLastWeek < 2 ? '#87A878' : '#BFA616' : '#F95B3D'
        },
        avgPainLevelByTime:{
            averagePainTwelveAmToSixAm:averagePainTwelveAmToSixAm,
            averagePainTwelveAmToSixAmColor: averagePainTwelveAmToSixAm < 3 ? averagePainTwelveAmToSixAm < 2 ? '#87A878' : '#BFA616' : '#F95B3D',
            averagePainSixAmToTwelvePm:averagePainSixAmToTwelvePm,
            averagePainSixAmToTwelvePmColor: averagePainSixAmToTwelvePm < 3 ? averagePainSixAmToTwelvePm < 2 ? '#87A878' : '#BFA616' : '#F95B3D',
            averagePainTwelvePmToSixPm:averagePainTwelvePmToSixPm,
            averagePainTwelvePmToSixPmColor: averagePainTwelvePmToSixPm < 3 ? averagePainTwelvePmToSixPm < 2 ? '#87A878' : '#BFA616' : '#F95B3D',
            averagePainSixPmToTwelveAm:averagePainSixPmToTwelveAm,
            averagePainSixPmToTwelveAmColor:averagePainSixPmToTwelveAm < 3 ? averagePainSixPmToTwelveAm < 2 ? '#87A878' : '#BFA616' : '#F95B3D',
        },
        avgPainLevelBySleep:{
            averageLessThanSix:averageLessThanSix,
            averageLessThanSixColor:averageLessThanSix < 3 ? averageLessThanSix < 2 ? '#87A878' : '#BFA616' : '#F95B3D',
            averageSixToEight:averageSixToEight,
            averageSixToEightColor:averageSixToEight < 3 ? averageSixToEight < 2 ? '#87A878' : '#BFA616' : '#F95B3D',
            averageMoreThanEight:averageMoreThanEight,
            averageMoreThanEightColor:averageMoreThanEight < 3 ? averageMoreThanEight < 2 ? '#87A878' : '#BFA616' : '#F95B3D',
        },
        avgPainLevelByArea:{
            area1:{
                name: areaResult[0] ? areaResult[0].name : '',
                average:areaResult[0] ? areaResult[0].average : null,
                color:areaResult[0] ? areaResult[0].average < 3 ? areaResult[0].average < 2 ? '#87A878' : '#BFA616' : '#F95B3D' : null,
            },
            area2: {
                name: areaResult[1] ? areaResult[1].name : '',
                average:areaResult[1] ? areaResult[1].average : null,
                color:areaResult[1] ? areaResult[1].average < 3 ? areaResult[1].average < 2 ? '#87A878' : '#BFA616' : '#F95B3D' : null,
            },
            area3: {
                name: areaResult[2] ? areaResult[2].name : '',
                average: areaResult[2] ? areaResult[2].average : null,
                color:areaResult[2] ? areaResult[2].average < 3 ? areaResult[2].average < 2 ? '#87A878' : '#BFA616' : '#F95B3D' : null
            }
        }
    }
}

const compareAreaAverage = (a,b) => {
    if(a.average > b.average) {
        return -1;
    }
    if(a.average < b.average) {
        return 1;
    }
    return 0;
}