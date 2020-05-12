/**CONSTANTS */
const DPI_SCALE = window.devicePixelRatio
const PARAMETERS = {
  scale_step: 0.1,
  min_scale: 500,
  max_scale: 30,
  position_factor: [ 0.85, 0.755 ],
  render_scale: 100,
  render_offset:  [ 0, 0 ],
  viewport_rect: [ 0, 0, 1, 1 ],
  zoom_animation_duration: 0.15,
  render_tile_fill_color: "#131313",
  render_tile_stroke_color: "#26282f"
}


/*CANVAS RENDERING */
let canvas_el = window.canvas_el
let context_2d = canvas_el.getContext( "2d" )

function update_canvas_size () {
  canvas_el.width = window.innerWidth * DPI_SCALE
  canvas_el.height = window.innerHeight * DPI_SCALE
}

function draw_hex ( x_index, y_index, color ) {
  color = color || `#${(Math.floor(Math.random() * 0xFFFFFF)).toString(16)}`
  context_2d.fillStyle = color

  context_2d.font = `${Math.max(1, 0.1 * PARAMETERS.render_scale)}px sans-serif`;
  context_2d.strokeStyle = PARAMETERS.render_tile_stroke_color
  context_2d.fillStyle = PARAMETERS.render_tile_fill_color
  context_2d.lineWidth = 2
  context_2d.beginPath()

  let x_offset = ( y_index % 2 ) === 0 ? (0.5) * PARAMETERS.render_scale : 0

  let x = (((x_index) * PARAMETERS.render_scale) + x_offset ) * PARAMETERS.position_factor[0] + PARAMETERS.render_offset[ 0 ]
  let y = ((y_index) * PARAMETERS.render_scale) * PARAMETERS.position_factor[1] + PARAMETERS.render_offset[ 1 ]

  context_2d.moveTo(x + ( PARAMETERS.render_scale / 2 ) * Math.cos(0 + (Math.PI / 2)), y + ( PARAMETERS.render_scale / 2 ) * Math.sin(0 + (Math.PI / 2)));

  for (let i = 0; i < 7; i++) {
    context_2d.lineTo(x + ( PARAMETERS.render_scale / 2 ) * Math.cos((i * 2 * Math.PI / 6)  + (Math.PI / 2)), y + ( PARAMETERS.render_scale / 2 ) * Math.sin((i * 2 * Math.PI / 6)  + (Math.PI / 2)));
  }

  context_2d.closePath()
  context_2d.fill()
  context_2d.fillStyle = "#ffffff"
  context_2d.textAlign = "center"
  context_2d.fillText(`${x_index.toFixed(0)} : ${y_index.toFixed(0)}`, x, y);
  context_2d.stroke()
}

function update_viewport () {
  let x = Math.floor(-(PARAMETERS.render_offset[0] / PARAMETERS.render_scale)  / PARAMETERS.position_factor[0])
  let y =  Math.floor(-(PARAMETERS.render_offset[1] / PARAMETERS.render_scale) / PARAMETERS.position_factor[1]) 

  let width = Math.ceil( ((1 / PARAMETERS.render_scale) * (window.innerWidth)) / PARAMETERS.position_factor[0] ) + 2
  let height = Math.ceil( ((1 / PARAMETERS.render_scale) * (window.innerHeight))  / PARAMETERS.position_factor[1] ) + 2


  PARAMETERS.viewport_rect = [ x, y, width, height ]
}

function render () {
  requestAnimationFrame ( render )
  context_2d.clearRect( 0, 0, canvas_el.width, canvas_el.height )

  for ( let a = PARAMETERS.viewport_rect[0]; a < PARAMETERS.viewport_rect[0] + PARAMETERS.viewport_rect[2]; a++ ){
    for (let b = PARAMETERS.viewport_rect[1]; b < PARAMETERS.viewport_rect[1] + PARAMETERS.viewport_rect[3]; b++) {
        draw_hex( a, b, "#000000" ) 
    }
  }

  // for ( let b = 0; b < 10; b++ ){
  //     for (let a = 0; a < 10; a++) {
  //         draw_hex( a, b, "#000000" ) 
  //     }
  //   }
}

function setup_canvas_interactivity () {
  canvas_el.addEventListener( "mousewheel", _.throttle( ( evt )=>{
    let target_scale = PARAMETERS.render_scale

    if ( evt.deltaY > 0 ) {
      target_scale = PARAMETERS.render_scale * ( 1 + PARAMETERS.scale_step )
      if ( target_scale > PARAMETERS.min_scale ) target_scale = PARAMETERS.min_scale
    } else {
      target_scale = PARAMETERS.render_scale * ( 1 - PARAMETERS.scale_step )
      if ( target_scale < PARAMETERS.max_scale ) target_scale = PARAMETERS.max_scale
    }

    
    TweenMax.to( PARAMETERS, PARAMETERS.zoom_animation_duration, {
      render_scale: target_scale,
      onUpdate: ()=> update_viewport()
    } )
    
  }, 1000/60 ) )



  let captured = false
  let prev_pos = [ 0, 0 ] 

  document.addEventListener( "mousedown", ( evt )=>{
    let mouse_x = evt.pageX
    let mouse_y = evt.pageY
    prev_pos[0] = mouse_x
    prev_pos[1] = mouse_y

    captured = true
  } )

  canvas_el.addEventListener( "mousemove", ( evt )=>{
    if ( captured ) {
      let mouse_x = evt.pageX
      let mouse_y = evt.pageY

      let delta_x = mouse_x - prev_pos[0]
      let delta_y = mouse_y - prev_pos[1]

      PARAMETERS.render_offset[0] += delta_x
      PARAMETERS.render_offset[1] += delta_y
      
      update_viewport()

      prev_pos[0] = mouse_x
      prev_pos[1] = mouse_y
    }
  } )

  document.addEventListener( "mouseup", ()=>{
    captured = false
  } )
}

/*setting up dat.GUI*/
let dat_gui = new dat.GUI();
let dat_render_folder = dat_gui.addFolder( "RENDERING" )
dat_render_folder.addColor( PARAMETERS, "render_tile_fill_color" ).name("Tile Fill Color")
dat_render_folder.addColor( PARAMETERS, "render_tile_stroke_color" ).name("Tile Stroke Color")

/** SCISO HEX */
update_canvas_size()
update_viewport()
setup_canvas_interactivity()
window.addEventListener( "resize", ()=>{
  update_canvas_size()
} )

requestAnimationFrame ( render )

