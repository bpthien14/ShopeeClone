import React, { FC } from 'react'
import {Slide} from 'react-slideshow-image'
import styles from './productSlideshow.module.css'
import 'react-slideshow-image/dist/styles.css'
interface Props {
    images: string[];
}
export const ProductSlideShow: FC<Props> = ({ images }) => {
  return (
    <Slide
        easing='ease'
        duration={ 7000 }
        indicators
    >
        {
            images.map( image => {
                return (
                    <div className={ styles['each-slide'] } key={ image }>
                        <div style={{
                            backgroundImage: `url(${ image })`,
                            backgroundSize: 'cover'
                        }}>

                        </div>
                    </div>
                )
            })
        }
    </Slide>
  )
}