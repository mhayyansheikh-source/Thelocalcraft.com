"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function DynamicLightingBackground() {
    const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'dusk' | 'night'>('day')

    useEffect(() => {
        const updateLighting = () => {
            const hour = new Date().getHours()
            if (hour >= 5 && hour < 8) setTimeOfDay('dawn')
            else if (hour >= 8 && hour < 17) setTimeOfDay('day')
            else if (hour >= 17 && hour < 20) setTimeOfDay('dusk')
            else setTimeOfDay('night')
        }
        
        updateLighting()
        const interval = setInterval(updateLighting, 60000) // check every minute
        return () => clearInterval(interval)
    }, [])

    const getGradient = () => {
        switch(timeOfDay) {
            case 'dawn': return 'radial-gradient(circle at top right, rgba(162, 89, 255, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(255, 107, 107, 0.1), transparent 50%)'
            case 'day': return 'radial-gradient(circle at top right, rgba(255, 193, 7, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.05), transparent 50%)'
            case 'dusk': return 'radial-gradient(circle at top right, rgba(255, 107, 107, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(255, 166, 0, 0.1), transparent 50%)'
            case 'night': return 'radial-gradient(circle at top right, rgba(50, 50, 150, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(10, 10, 30, 0.5), transparent 50%)'
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, background: getGradient() }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ 
                zIndex: -1,
                backgroundColor: '#0a0a0a', // Deep dark base
            }}
        />
    )
}
