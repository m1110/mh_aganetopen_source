import { useTheme as useNextTheme } from 'next-themes'
import { Switch, useTheme, Grid, Spacer } from '@nextui-org/react'
import { EllipsisHorizontalIcon, ChevronDoubleUpIcon, ChevronUpDownIcon, CursorArrowRaysIcon } from "@heroicons/react/20/solid";
import { Button } from '@geist-ui/core'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import _styles from '../../styles/stickyMenu.module.css'; // Import the CSS module
import { useRouter } from 'next/router';

function ThreadsHuntLogo() {
  return (
  <CursorArrowRaysIcon style={{ width: 50, height: 36}} />
  )
}

function Avatar({ src }) {
  return(
    <img style={{ height: 30, width: 30, borderRadius: 100, border: `1px solid lightgrey` }} src={src} alt="avatar" />
  )
}


const PublicNav = () => {
    const { setTheme } = useNextTheme();
    const { isDark, type, resolvedTheme, theme } = useTheme();
    const [hover, setHover] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    

    // Determine if we're in mobile view
    const isMobile = windowWidth <= 450;

    // styles, adjusted based on whether we're in mobile view
  const menuStyle = {
    padding: isMobile ? "0 5px" : "0 10px",
    // other styles...
  };

  const halfStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: isMobile ? "column" : "row",
    // other styles...
  };

    useEffect(() => {
        const handleScroll = () => {
          const isScrolled = window.scrollY > 43;
          if (isScrolled !== scrolled) {
            setScrolled(!scrolled);
          }
        };
    
        document.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
          // cleanup - remove the listener when the component unmounts
          document.removeEventListener('scroll', handleScroll);
        };
      }, [scrolled]);


      useEffect(() => {
        // Update window width upon mount and when window is resized
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
  
    return (
<>
   <div className={_styles.stickyMenu} style={{ background: theme.backgroundColor, width: isMobile ? '' : `100%`, ...menuStyle }}>
   {/* <div > */}
     <div style={{ 
      ...halfStyle, 
      backgroundColor: scrolled ? 'hsla(0,0%,100%, .8)' : 'white' || 'hsla(0,0%,100%, .8)'|| 'white' || '#F5F5F5', 
      backdropFilter: scrolled ? 'blur(5px)' : 'none', 
      boxShadow: scrolled ? `inset 0 -1px 0 0 rgba(0,0,0,.1)` : ``, 
      transitionDuration: `0.2s, 0.2s`, 
      transitionTimingFunction: 'ease, ease', 
      transitionDelay: '0s, 0s', 
      transitionProperty: 'box-shadow, background-color', 
      position: 'sticky', 
      top: 0, 
      display: 'flex', 
      justifyContent: 'center', 
      zIndex: '100001' 
      }}>

      <header>
        <nav style={{ width: `80vw`, marginLeft: `auto`, marginRight: `auto`, paddingTop: 5, paddingBottom: 5, display: 'flex', alignItems: 'center',justifyContent: 'space-between', paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '0px' }} className='left_half'>
            <ThreadsHuntLogo />
            <span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: '1.25rem', fontWeight: 500 }}>
              <Link style={{ display: 'inline-flex', alignItems: 'center' }} href={''}>
              <Spacer x={.3} />
              {/* <span style={{ color: 'black' }}>Upstream</span> */}
              <h1 style={{ color: 'black', fontSize: '30px'}} className='hero_title'>FineTune Transcripts</h1>
              <Spacer x={.5} />
              </Link>
            </span>
            
          </div>
          <div className='right_half'>
            <Link href="/Feature">
            {/* <Button type="button">Request Features</Button> */}
          </Link>
            {/* <Link style={{ color: 'black ', marginRight: '10px'}} href="/blog">Blog</Link> */}
            <span style={{ marginTop: '20px'}}>
            </span>
            {/* <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false) } style={{ border: hover ? '1px solid #9ca3af50' : '1px solid transparent', borderRadius: '2px', backgroundColor: 'transparent', marginRight: '10px', width: '28px' }} type="button">
              <EllipsisHorizontalIcon style={{ color: 'gray', paddingTop: '1px'}} scale={2.0}/>
            </button> */}
        
          </div>
        </nav>
      </header>
    </div>
    </div>
    </>

    )

}

export default PublicNav;


