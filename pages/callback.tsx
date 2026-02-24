import { DataContext } from '../context/DataContext';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useContext } from 'react'
import { Loading } from '@geist-ui/core';
// import '../public/fonts/fonts.css'
import '@/app/globals.css'




export default function Callback(props: any) {
    const { } = props;
    const router = useRouter();
    const [ count, setCount ] = useState<any>(0)
    // const [ data, setData ] = useContext(DataContext)
    const styles ={
        container: {
            display: 'flex',
            justifyContent: 'center',
            marginTop: '40vh',
        }
    }

    const query = router.query
    const code = router.query.code
    const scope = router.query.scope 
    console.log(`query`, query)
    // console.log(`callback - data`, data)
    
    useEffect(() => {
        // const state: any = router.query.state 
        const handlePassedInCode = async () => {
            const origin = window.location.origin
            console.log(`router.query.state`, router.query.state)
            console.log(`origin: `, origin);
            const state: any = router.query.state 
            
            // const userSubscriptionObject: any = JSON.parse(state)
            // console.log(`userSubscriptionObject: `, userSubscriptionObject)
            if(router.query.code) {
                const host = `https://guidelinebuddybackend-91e9844f3425.herokuapp.com`
                const hasstate = `${host}/introspect-ai/google/route?code=${code}&origin=${origin}&subObj=${state}` || `/api/google?code=${code}&origin=${origin}&subObj=${state}`
                const nostate = `${host}/introspect-ai/google/route?code=${code}&origin=${origin}` || `/api/google?code=${code}&origin=${origin}`
                try {
                    console.log({ hasstate })
                    console.log({ nostate })
                    const res = await fetch( state && state !== undefined ? hasstate : nostate , {
                      method: 'GET'
                    });
                    if(res.status === 200 ){
                      var body = await res.json()
                      console.log(`🎃 body`, body);
                      
                      console.log(`body.url`, body.url)
                      localStorage.setItem('userData', JSON.stringify({ 
                        name: body.data.username,
                        email: body.data.email,
                        familyName: body.data.familyName,
                        image: body.data.image,
                        userId: body.data.userID,
                        // conversations: body.data.messages
                      }));
                      console.log('about to redirect to body.url', body.url)
                      return router.push('/')
                    } else if(res.status === 400){
                      console.log("something happened, Storage unsuccessful");
                      var getThe = await res.json()
                      var msg = getThe.msg
                      if(msg === "looks like there is already a user with this email address. Choose another and resubmit to continue"){
        
                      }
                    //   setToast({ text: `This address already has an account. use the "sign in" link to login`, type: 'error', delay: 4000 })
        
                    }
                  } catch (error) {
                    console.log("somethings wrong on GET, Storage unsuccessful ", error);
                }
        
                console.log('update call')
            };
    
            
        }
            handlePassedInCode()
       
    }, [code]);
    
   

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
                    <div className="flex items-center"></div>
                </header>
                <main className="flex flex-col flex-1 bg-muted/50">
                    <div style={{...styles.container, fontFamily: 'Geist-Medium' }}>logging you in</div>
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center'}}><Loading /></div>
                </main>
            </div>
        </>
    )
}