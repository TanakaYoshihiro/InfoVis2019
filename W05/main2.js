function main()
{
    var width = 500;
    var height = 500;

    var scene = new THREE.Scene();

    var fov = 45;
    var aspect = width / height;
    var near = 1;
    var far = 1000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 5 );
    scene.add( camera );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.Geometry();
    var material = new THREE.MeshBasicMaterial();
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );



    var vertices = [
        [ -1, -1, -1 ], // v0
        [  1, -1, -1 ], // v1
        [  1,  1, -1 ], // v2
        [ -1,  1, -1 ], // v3
        [ -1, -1,  1 ], // v4
        [  1, -1,  1 ], // v5
        [  1,  1,  1 ], // v6
        [ -1,  1,  1 ]  // v7
    ];

    var faces = [
        [ 0, 1, 5 ], // f0
        [ 0, 5, 4 ], // f1
        [ 4, 5, 7 ], // f2
        [ 5, 6, 7 ], // f3
        [ 1, 2, 6 ], // f4
        [ 1, 6, 5 ], // f5
        [ 3, 1, 0 ], // f6
        [ 3, 2, 1 ], // f7
        [ 7, 6, 2 ], // f8
        [ 7, 2, 3 ], // f9
        [ 4, 7, 3 ], // f10
        [ 4, 3, 0 ], // f11
    ];
    var nvertices = vertices.length;
    for ( var i = 0; i < nvertices; i++ )
    {
        var vertex = new THREE.Vector3().fromArray( vertices[i] );
        geometry.vertices.push( vertex );
    }
    var nfaces = faces.length;
    for ( var i = 0; i < nfaces; i++ )
    {
        var id = faces[i];
        var face = new THREE.Face3( id[0], id[1], id[2] );
        geometry.faces.push( face );
    }
    //Assign a color to each face.
    material.vertexColors = THREE.FaceColors;
    for ( var i = 0; i < nfaces; i++ )
    {
        geometry.faces[i].color = new THREE.Color( 1, 1, 1 );
    }



    geometry.computeFaceNormals();

    var light = new THREE.PointLight();
    light.position.set( 1, 1, 1 );
    scene.add( light );

    document.addEventListener( 'mousedown', mouse_down_event );
    function mouse_down_event( event )
    {
        // Clicked point in window coordinates
        var x_win = event.clientX;
        var y_win = event.clientY;

        // Window coordinates to NDC
        var vx = renderer.domElement.offsetLeft;
        var vy = renderer.domElement.offsetTop;
        var vw = renderer.domElement.width;
        var vh = renderer.domElement.height;

        var x_NDC = 2 * ( x_win - vx ) / vw - 1;
        var y_NDC = -( 2 * ( y_win - vy ) / vh - 1 );

        // NDC to world coordinates
        var p_NDC = new THREE.Vector3( x_NDC, y_NDC, 1 );
        var p_wld = p_NDC.unproject( camera );
        // Origin and direction of the ray
        var origin = camera.position;
        var direction = p_wld.sub( camera.position ).normalize();

        // THREE.Raycaster
        var raycaster = new THREE.Raycaster( origin, direction );
        var intersects = raycaster.intersectObject( cube );
        if ( intersects.length > 0 )
        {
            intersects[0].face.color.setRGB( 1, 0, 0 );
            intersects[0].object.geometry.colorsNeedUpdate = true;
        }
    }


    loop();

    function loop()
    {
        requestAnimationFrame( loop );
        cube.rotation.x += 0.001;
        cube.rotation.y += 0.001;
        renderer.render( scene, camera );
    }
}
