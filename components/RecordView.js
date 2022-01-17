import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";


const RecordView = ({recordId,pid,session}) => {

    const [pageLoading,setPageLoading] = useState(true);
    const router = useRouter();
    const [diaryId, setDiaryId] = useState(null);
    const [recordData,setRecordData] = useState(null);

    useEffect(() => {
        async function getRecord() {
            const res = await fetch('/api/record/single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId:session.user.id,
                    diaryId:pid,
                    recordId:recordId
                })
            });

            return await res.json();
        }

        setPageLoading(true);
        getRecord().then((res) => {
            if(!res.data) {
                router.push('/home');
            }else if (res.type) {
                //TODO:Return error message
            }else {
                setDiaryId(res.data.diaryId);
                setRecordData(res.data.record);
                setPageLoading(false);
            }
        })

    },[pid, recordId, router, session.user.id]);

    return(
        <h1>
            {`${diaryId} -> ${recordData} (If id -> null then All Working!!)`}
        </h1>
    )
}

export default RecordView;