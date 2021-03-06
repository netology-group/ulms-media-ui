/* eslint-disable react/prop-types */
import React from 'react'
import cx from 'classnames-es'
import EventTarget from '@ungap/event-target'

import { LocationObjectCursor } from './_location-object-cursor'
import { ObjectPortal } from './_object-portal'
import css from './location-viewport.module.css'

const Emitter = (...argv) => new EventTarget(...argv)

// eslint-disable-next-line react/prefer-stateless-function
export class LocationViewport extends React.PureComponent {
  static emitter (...argv) {
    return Emitter(...argv)
  }

  constructor (props) {
    super(props)

    this.__viewportEl = undefined

    /* eslint-disable-next-line react/state-in-constructor */
    this.state = { objects: props.cursors || [] }
  }

  componentDidMount () {
    const { emitter } = this.props

    emitter && emitter.addEventListener('broadcast_message.create', (e) => {
      if (!e.detail || !e.detail.data) {
        // eslint-disable-next-line no-console
        console.warn('Can not parse broadcast event')

        return
      }

      const { data } = e.detail

      const objects = Array.isArray(data) ? data : [data]

      this.setState({ objects })
    })
  }

  set viewportEl (el) {
    this.__viewportEl = el
  }

  render () {
    const {
      boundLower,
      boundUpper,
      className,
      height,
      id,
      width,
    } = this.props

    const { objects } = this.state

    const viewportWidth = width || boundUpper[0]
    const viewportHeight = height || boundUpper[1]

    return (
      <section
        className={cx({ [css.root]: true, [className]: className })}
        id={cx({ [id]: id })}
        style={{
          position: 'absolute',
          width: viewportWidth,
          height: viewportHeight,
        }}
      >
        <div className={css.outer} ref={(el) => { this.viewportEl = el }}>
          <>
            {objects.map((obj) => {
              const { x, y } = obj.aCoords.tl

              return (
                <ObjectPortal key={`id_${obj.id}`} node={this.__viewportEl}>
                  <LocationObjectCursor
                    boundLower={boundLower}
                    boundUpper={boundUpper}
                    className={css.object}
                    defaultCursorRotation={45}
                    id={obj.id}
                    left={x}
                    style={obj.style}
                    text={obj.text}
                    top={y}
                    viewport={this.__viewportEl}
                  />
                </ObjectPortal>
              )
            })}
          </>
        </div>
      </section>
    )
  }
}
