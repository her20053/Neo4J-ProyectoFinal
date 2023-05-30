from flask import Flask, jsonify, request
from neo4j import GraphDatabase
from flask_cors import CORS
import json
from datetime import datetime
from flask.json import JSONEncoder
from random import randint

app = Flask(__name__)
CORS(app)

uri = "neo4j+s://e91efb87.databases.neo4j.io"
user = "neo4j"
password = "08AzTpjVxFvdxiXsQMRmbfgzsczNhF92nvVb1DptKPU"

driver = GraphDatabase.driver(uri, auth=(user, password))

# -------------------------------------------------------------------------------------------

def obtener_usuario_por_correo(tx, correo_electronico):
    query = '''
    MATCH (u:Usuario {correo_electronico: $correo_electronico})
    RETURN u
    '''
    result = tx.run(query, correo_electronico=correo_electronico)
    record = result.single()
    return record['u'] if record else None

def buscar_usuario_por_correo(correo_electronico):
    with driver.session() as session:
        usuario = session.execute_read(obtener_usuario_por_correo, correo_electronico)

    if usuario:
        return {
            "id": usuario['id'],
            "nombre": usuario['nombre'],
            "apellido": usuario['apellido'],
            "correo_electronico": usuario['correo_electronico'],
            "fecha_nacimiento": usuario['fecha_nacimiento'].isoformat(),
            "ubicación": usuario['ubicación'],
            "habilidades": usuario['habilidades'],
            "intereses": usuario['intereses'],
            "biografía": usuario['biografía']
        }
    else:
        return {"mensaje": "correo no encontrado"}

# -------------------------------------------------------------------------------------------

def obtener_eventos_por_correo(tx, correo_electronico):
    query = '''
    MATCH (u:Usuario {correo_electronico: $correo_electronico})-[:ASISTE]->(e:Evento)
    RETURN e
    '''
    result = tx.run(query, correo_electronico=correo_electronico)
    eventos = [record['e'] for record in result]
    return eventos

def buscar_eventos_por_correo(correo_electronico):
    with driver.session() as session:
        eventos = session.execute_read(obtener_eventos_por_correo, correo_electronico)

    eventos_json = []
    for evento in eventos:
        evento_json = {
            "id": evento['id'],
            "nombre": evento['nombre'],
            "descripcion": evento['descripción'],
            "fecha_inicio": evento['fecha_inicio'].isoformat(),
            "fecha_fin": evento['fecha_fin'].isoformat(),
            "ubicacion": evento['ubicación']
        }
        eventos_json.append(evento_json)

    return eventos_json

# -------------------------------------------------------------------------------------------

def obtener_solicitudes_amistad(tx, correo_electronico):
    query = '''
    MATCH (u1:Usuario)-[:ENVIA_SOLICITUD]->(u2:Usuario {correo_electronico: $correo_electronico})
    RETURN u1
    '''
    result = tx.run(query, correo_electronico=correo_electronico)
    usuarios = [record['u1'] for record in result]
    return usuarios

def buscar_solicitudes_amistad(correo_electronico):
    with driver.session() as session:
        usuarios = session.execute_read(obtener_solicitudes_amistad, correo_electronico)

    usuarios_json = []
    for usuario in usuarios:
        usuario_json = {
            "id": usuario['id'],
            "nombre": usuario['nombre'],
            "apellido": usuario['apellido'],
            "correo_electronico": usuario['correo_electronico'],
            "fecha_nacimiento": usuario['fecha_nacimiento'].isoformat(),
            "ubicación": usuario['ubicación'],
            "habilidades": usuario['habilidades'],
            "intereses": usuario['intereses'],
            "biografía": usuario['biografía']
        }
        usuarios_json.append(usuario_json)

    return usuarios_json

# -------------------------------------------------------------------------------------------

def obtener_amigos(tx, correo_electronico):
    query = '''
    MATCH (u1:Usuario {correo_electronico: $correo_electronico})-[:ES_AMIGO]-(u2:Usuario)
    WHERE (u2)-[:ES_AMIGO]-(u1)
    RETURN u2
    '''
    result = tx.run(query, correo_electronico=correo_electronico)
    usuarios = [record['u2'] for record in result]
    return usuarios

def buscar_amigos(correo_electronico):
    with driver.session() as session:
        amigos = session.execute_read(obtener_amigos, correo_electronico)

    amigos_json = []
    for amigo in amigos:
        amigo_json = {
            "id": amigo['id'],
            "nombre": amigo['nombre'],
            "apellido": amigo['apellido'],
            "correo_electronico": amigo['correo_electronico'],
            "fecha_nacimiento": amigo['fecha_nacimiento'].isoformat(),
            "ubicación": amigo['ubicación'],
            "habilidades": amigo['habilidades'],
            "intereses": amigo['intereses'],
            "biografía": amigo['biografía']
        }
        amigos_json.append(amigo_json)

    return amigos_json

# -------------------------------------------------------------------------------------------

# ------------------------------ AREA DE PUBLICACIONES --------------------------------------

def obtener_publicaciones_amigos(tx, correo_electronico):
    query = '''
    MATCH (u:Usuario {correo_electronico: $correo_electronico})-[:ES_AMIGO]-(amigo)-[:CREA]->(p:Publicación)
    RETURN p, amigo
    '''
    result = tx.run(query, correo_electronico=correo_electronico)
    return result.data()

def obtener_publicaciones_propias(tx, correo_electronico):
    query = '''
    MATCH (u:Usuario {correo_electronico: $correo_electronico})-[:CREA]->(p:Publicación)
    RETURN p, u
    '''
    result = tx.run(query, correo_electronico=correo_electronico)
    return result.data()


def buscar_publicaciones_amigos(correo_electronico):
    with driver.session() as session:
        publicaciones = session.execute_read(obtener_publicaciones_amigos, correo_electronico)
    
    for publicacion in publicaciones:
        if 'p' in publicacion and 'fecha_creacion' in publicacion['p']:
            fecha = publicacion['p']['fecha_creacion']
            publicacion['p']['fecha_creacion'] = f"{fecha.year}-{fecha.month:02d}-{fecha.day:02d} {fecha.hour:02d}:{fecha.minute:02d}:{fecha.second:02d}"
        
        if 'amigo' in publicacion and 'fecha_nacimiento' in publicacion['amigo']:
            fecha_nacimiento = publicacion['amigo']['fecha_nacimiento']
            publicacion['amigo']['fecha_nacimiento'] = f"{fecha_nacimiento.year}-{fecha_nacimiento.month:02d}-{fecha_nacimiento.day:02d}"
    
    return publicaciones


def buscar_publicaciones_propias(correo_electronico):
    with driver.session() as session:
        publicaciones = session.execute_read(obtener_publicaciones_propias, correo_electronico)
    
    for publicacion in publicaciones:
        if 'p' in publicacion and 'fecha_creacion' in publicacion['p']:
            fecha = publicacion['p']['fecha_creacion']
            publicacion['p']['fecha_creacion'] = f"{fecha.year}-{fecha.month:02d}-{fecha.day:02d} {fecha.hour:02d}:{fecha.minute:02d}:{fecha.second:02d}"
        
        if 'u' in publicacion and 'fecha_nacimiento' in publicacion['u']:
            fecha_nacimiento = publicacion['u']['fecha_nacimiento']
            publicacion['u']['fecha_nacimiento'] = f"{fecha_nacimiento.year}-{fecha_nacimiento.month:02d}-{fecha_nacimiento.day:02d}"
    
    return publicaciones


def obtener_comentarios_publicacion(tx, publicacion_id):
    query = '''
    MATCH (c:Comentario)-[e:EN_PUBLICACION]->(p:Publicación {id: $publicacion_id})
    MATCH (n)-[r:COMENTA]->(c)
    RETURN n, r, c, p, e
    '''
    result = tx.run(query, publicacion_id=publicacion_id)
    comentarios = [record for record in result]
    return comentarios

def buscar_comentarios_publicacion(publicacion_id):
    with driver.session() as session:
        comentarios = session.execute_read(obtener_comentarios_publicacion, publicacion_id)
    
    comentarios_json = []
    for comentario in comentarios:
        comentario_json = {
            "id": comentario['c']['id'],
            "contenido": comentario['c']['contenido'],
            "fecha_creacion": comentario['c']['fecha_creacion'].isoformat(),
            "me_gusta": comentario['c']['me_gusta'],
            "publicacion_id": comentario['p']['id'],
            "usuario": {
                "id": comentario['n']['id'],
                "nombre": comentario['n']['nombre'],
                "apellido": comentario['n']['apellido'],
                "correo_electronico": comentario['n']['correo_electronico']
            }
        }
        comentarios_json.append(comentario_json)

    return comentarios_json


def crear_publicacion(tx, correo_electronico, contenido):
    id_publicacion = randint(1, 10000)  # Generar número aleatorio para el ID de la publicación
    fecha_creacion = datetime.now()  # Obtener la fecha y hora actual

    # Crear la publicación en la base de datos
    query_creacion = '''
    CREATE (p:Publicación {
      id: $id_publicacion,
      contenido: $contenido,
      fecha_creacion: $fecha_creacion,
      me_gusta: 0,
      privacidad: true
    })
    '''
    tx.run(query_creacion, id_publicacion=id_publicacion, contenido=contenido, fecha_creacion=fecha_creacion)

    # Asociar la publicación al usuario que la creó
    query_asociacion = '''
    MATCH (u:Usuario {correo_electronico: $correo_electronico}), (p:Publicación {id: $id_publicacion})
    CREATE (u)-[:CREA {fecha: $fecha_creacion}]->(p)
    RETURN u, p
    '''
    result = tx.run(query_asociacion, correo_electronico=correo_electronico, id_publicacion=id_publicacion, fecha_creacion=fecha_creacion)
    record = result.single()
    return record['u'], record['p']

def crear_comentario(tx, correo_electronico, contenido, publicacion_id):
    id_comentario = randint(1, 10000)  # Generar número aleatorio para el ID del comentario
    fecha_creacion = datetime.now()  # Obtener la fecha y hora actual

    # Crear el comentario en la base de datos
    query_creacion = '''
    CREATE (c:Comentario {
      id: $id_comentario,
      contenido: $contenido,
      fecha_creacion: $fecha_creacion,
      me_gusta: 0
    })
    '''
    tx.run(query_creacion, id_comentario=id_comentario, contenido=contenido, fecha_creacion=fecha_creacion)

    # Asociar el usuario al comentario
    query_asociacion_usuario = '''
    MATCH (u:Usuario {correo_electronico: $correo_electronico}), (c:Comentario {id: $id_comentario})
    CREATE (u)-[:COMENTA {fecha: $fecha_creacion}]->(c)
    RETURN u, c
    '''
    result_usuario = tx.run(query_asociacion_usuario, correo_electronico=correo_electronico, id_comentario=id_comentario, fecha_creacion=fecha_creacion)
    record_usuario = result_usuario.single()

    # Asociar el comentario a la publicación
    query_asociacion_publicacion = '''
    MATCH (c:Comentario {id: $id_comentario}), (p:Publicación {id: $publicacion_id})
    CREATE (c)-[:EN_PUBLICACION]->(p)
    RETURN c, p
    '''
    result_publicacion = tx.run(query_asociacion_publicacion, id_comentario=id_comentario, publicacion_id=publicacion_id)
    record_publicacion = result_publicacion.single()

    return record_usuario['u'], record_publicacion['p']

def incrementar_me_gusta_publicacion(publicacion_id):
    with driver.session() as session:
        session.run(
            "MATCH (p:Publicación {id: $publicacion_id}) "
            "SET p.me_gusta = p.me_gusta + 1",
            publicacion_id=publicacion_id
        )


def eliminar_solicitud_amistad(tx, correo_emisor, correo_receptor):
    query = '''
    MATCH (u1:Usuario {correo_electronico: $correo_emisor})-[r:ENVIA_SOLICITUD]->(u2:Usuario {correo_electronico: $correo_receptor})
    DELETE r
    RETURN u1, u2
    '''
    result = tx.run(query, correo_emisor=correo_emisor, correo_receptor=correo_receptor)
    record = result.single()
    return record['u1'], record['u2']

def crear_relacion_amistad(tx, correo_emisor, correo_receptor):
    query = '''
    MATCH (u1:Usuario {correo_electronico: $correo_emisor}), (u2:Usuario {correo_electronico: $correo_receptor})
    CREATE (u1)-[:ES_AMIGO {fecha: datetime()}]->(u2)
    RETURN u1, u2
    '''
    result = tx.run(query, correo_emisor=correo_emisor, correo_receptor=correo_receptor)
    record = result.single()
    return record['u1'], record['u2']

def buscar_amigos_en_comun(tx, correo_electronico):
    query = '''
    MATCH (u:Usuario)
    OPTIONAL MATCH (u)-[:ES_AMIGO]-(commonFriend)-[:ES_AMIGO]-(targetUser:Usuario {correo_electronico: $target_email})
    WHERE NOT (u)-[:ES_AMIGO]-(targetUser)
    WITH u, collect(commonFriend.nombre + ' ' + commonFriend.apellido) as commonFriends
    ORDER BY SIZE(commonFriends) DESC
    RETURN u, commonFriends
    '''
    result = tx.run(query, target_email=correo_electronico)
    records = result.data()

    amigos_en_comun = []
    for record in records:
        usuario = record['u']
        amigos_comunes = record['commonFriends']
        
        amigos_en_comun.append({
            "usuario": {
                "id": usuario['id'],
                "nombre": usuario['nombre'],
                "apellido": usuario['apellido'],
                "correo_electronico": usuario['correo_electronico']
            },
            "amigos_comunes": amigos_comunes
        })
    
    return amigos_en_comun

def enviar_solicitud_amistad(tx, correo_emisor, correo_receptor):
    query = '''
    MATCH (u1:Usuario {correo_electronico: $correo_emisor}), (u2:Usuario {correo_electronico: $correo_receptor})
    CREATE (u1)-[:ENVIA_SOLICITUD {fecha: datetime()}]->(u2)
    RETURN u1, u2
    '''
    result = tx.run(query, correo_emisor=correo_emisor, correo_receptor=correo_receptor)
    record = result.single()
    return record['u1'], record['u2']

def obtener_usuario_y_eventos_asistencia(tx):
    query = '''
    MATCH (u:Usuario)-[r:ASISTE]->(e:Evento)
    RETURN u, r, e
    '''
    result = tx.run(query)
    return [(record['u'], record['r'], record['e']) for record in result]


def buscar_usuario_y_eventos_asistencia():
    with driver.session() as session:
        resultados = session.execute_read(obtener_usuario_y_eventos_asistencia)
    resultados_json = []
    for usuario, asiste, evento in resultados:
        resultado_json = {
            "usuario": {
                "id": usuario['id'],
                "nombre": usuario['nombre'],
                "apellido": usuario['apellido'],
                "correo_electronico": usuario['correo_electronico'],
                "fecha_nacimiento": usuario['fecha_nacimiento'].isoformat(),
                "ubicación": usuario['ubicación'],
                "habilidades": usuario['habilidades'],
                "intereses": usuario['intereses'],
                "biografía": usuario['biografía']
            },
            "asiste": {
                "fecha": asiste['fecha'].isoformat(),
                "confirmacion": asiste['confirmacion']
            },
            "evento": {
                "id": evento['id'],
                "nombre": evento['nombre'],
                "descripcion": evento['descripción'],
                "fecha_inicio": evento['fecha_inicio'].isoformat(),
                "fecha_fin": evento['fecha_fin'].isoformat(),
                "ubicacion": evento['ubicación']
            }
        }
        resultados_json.append(resultado_json)
    return resultados_json

def eliminar_asistencia(tx, correo_electronico, evento_id):
    query = """
    MATCH (u:Usuario {correo_electronico: $correo_electronico})-[r:ASISTE_A]->(e:Evento {id: $evento_id})
    DELETE r
    RETURN COUNT(r) as relationships_deleted
    """
    result = tx.run(query, correo_electronico=correo_electronico, evento_id=evento_id)
    record = result.single()
    return record['relationships_deleted'] > 0


def crear_asistencia(tx, correo_electronico, evento_id):
    query = '''
    MATCH (u:Usuario {correo_electronico: $correo_electronico}), (e:Evento {id: $evento_id})
    CREATE (u)-[:ASISTE {fecha: datetime(), confirmacion: true}]->(e)
    RETURN u, e
    '''
    result = tx.run(query, correo_electronico=correo_electronico, evento_id=evento_id)
    return result.single() is not None

def crear_participacion(tx, correo_electronico, grupo_id):
    query = '''
    MATCH (u:Usuario {correo_electronico: $correo_electronico}), (g:Grupo {id: $grupo_id})
    CREATE (u)-[:PARTICIPA {fecha: datetime(), rol: "Participante"}]->(g)
    RETURN u, g
    '''
    result = tx.run(query, correo_electronico=correo_electronico, grupo_id=grupo_id)
    return result.single() is not None
# ------------------------------------------------------------------------------------------------



@app.route('/api/usuarios/buscar', methods=['POST'])
def api_buscar_usuario_por_correo():
    correo_electronico = request.json['correo_electronico']
    resultado = buscar_usuario_por_correo(correo_electronico)
    return jsonify(resultado)

@app.route('/api/usuarios/solicitudes-amistad', methods=['POST'])
def api_buscar_solicitudes_amistad():
    correo_electronico = request.json['correo_electronico']
    solicitudes_amistad = buscar_solicitudes_amistad(correo_electronico)
    return jsonify(solicitudes_amistad)

@app.route('/api/usuarios/amigos', methods=['POST'])
def api_buscar_amigos():
    correo_electronico = request.json['correo_electronico']
    amigos = buscar_amigos(correo_electronico)
    return jsonify(amigos)

@app.route('/api/eventos/buscar', methods=['POST'])
def api_buscar_eventos_por_correo():
    correo_electronico = request.json['correo_electronico']
    eventos = buscar_eventos_por_correo(correo_electronico)
    return jsonify(eventos)

@app.route('/api/usuarios/publicaciones_amigos', methods=['POST'])
def api_buscar_publicaciones_amigos():
    correo_electronico = request.json['correo_electronico']
    publicaciones = buscar_publicaciones_amigos(correo_electronico)
    return jsonify(publicaciones)

@app.route('/api/usuarios/publicaciones_propias', methods=['POST'])
def api_buscar_publicaciones_propias():
    correo_electronico = request.json['correo_electronico']
    publicaciones = buscar_publicaciones_propias(correo_electronico)
    return jsonify(publicaciones)

@app.route('/api/comentarios/buscar', methods=['POST'])
def api_buscar_comentarios_publicacion():
    publicacion_id = request.json['publicacion_id']
    comentarios = buscar_comentarios_publicacion(publicacion_id)
    return jsonify(comentarios)

@app.route('/api/publicaciones/crear', methods=['POST'])
def api_crear_publicacion():
    correo_electronico = request.json['correo_electronico']
    contenido = request.json['contenido']

    with driver.session() as session:
        result = session.write_transaction(crear_publicacion, correo_electronico, contenido)

    if result:
        return jsonify({'mensaje': 'Publicación creada exitosamente'})
    else:
        return jsonify({'mensaje': 'Error al crear la publicación'})

@app.route('/api/comentarios/crear', methods=['POST'])
def api_crear_comentario():
    correo_electronico = request.json['correo_electronico']
    contenido = request.json['contenido']
    publicacion_id = request.json['publicacion_id']

    with driver.session() as session:
        result = session.write_transaction(crear_comentario, correo_electronico, contenido, publicacion_id)

    if result:
        return jsonify({'mensaje': 'Comentario creado exitosamente'})
    else:
        return jsonify({'mensaje': 'Error al crear el comentario'})

@app.route('/api/publicaciones/me-gusta', methods=['POST'])
def api_incrementar_me_gusta_publicacion():
    publicacion_id = request.json['publicacion_id']
    incrementar_me_gusta_publicacion(publicacion_id)
    return jsonify({"mensaje": "Se incrementó el número de me gusta"})

@app.route('/api/usuarios/agregar-amigos', methods=['POST'])
def api_agregar_amigos():
    correo_emisor = request.json['correo_emisor']
    correo_receptor = request.json['correo_receptor']

    with driver.session() as session:
        result = session.write_transaction(eliminar_solicitud_amistad, correo_emisor, correo_receptor)
        if result:
            result = session.write_transaction(crear_relacion_amistad, correo_emisor, correo_receptor)

    if result:
        return jsonify({'mensaje': 'Amistad creada exitosamente'})
    else:
        return jsonify({'mensaje': 'Error al agregar amigos'})


@app.route('/api/usuarios/eliminar-solicitud', methods=['POST'])
def api_eliminar_solicitud_amistad():
    correo_emisor = request.json['correo_emisor']
    correo_receptor = request.json['correo_receptor']

    with driver.session() as session:
        result = session.write_transaction(eliminar_solicitud_amistad, correo_emisor, correo_receptor)

    if result:
        return jsonify({'mensaje': 'Solicitud de amistad eliminada exitosamente'})
    else:
        return jsonify({'mensaje': 'Error al eliminar la solicitud de amistad'})



@app.route('/api/usuarios/common-friends', methods=['POST'])
def api_buscar_amigos_en_comun():
    correo_electronico = request.json['correo_electronico']
    
    with driver.session() as session:
        result = session.write_transaction(buscar_amigos_en_comun, correo_electronico)
    
    if result:
        return jsonify(result)
    else:
        return jsonify({'mensaje': 'No se encontraron amigos en común'})

@app.route('/api/usuarios/enviar-solicitud', methods=['POST'])
def api_enviar_solicitud_amistad():
    correo_emisor = request.json['correo_emisor']
    correo_receptor = request.json['correo_receptor']

    with driver.session() as session:
        result = session.write_transaction(enviar_solicitud_amistad, correo_emisor, correo_receptor)

    if result:
        return jsonify({'mensaje': 'Solicitud de amistad enviada exitosamente'})
    else:
        return jsonify({'mensaje': 'Error al enviar la solicitud de amistad'})


@app.route('/api/usuarios/eventos/asistencia', methods=['GET'])
def api_obtener_asistencia_eventos():
    try:
        resultados = buscar_usuario_y_eventos_asistencia()
        return jsonify(resultados)
    except Exception as e:
        return jsonify({'mensaje': 'Error al obtener la asistencia a eventos: {}'.format(e)})


@app.route('/api/usuarios/eventos/asistencia/eliminar', methods=['POST'])
def api_eliminar_asistencia():
    correo = request.json['correo']
    evento_id = request.json['evento_id']

    with driver.session() as session:
        eliminado = session.write_transaction(eliminar_asistencia, correo, evento_id)

    if eliminado:
        return jsonify({'mensaje': 'La asistencia se eliminó correctamente.'})
    else:
        return jsonify({'mensaje': 'Error al eliminar la asistencia. Asegúrate de que los datos sean correctos.'})

@app.route('/api/usuarios/eventos/asistencia/crear', methods=['POST'])
def api_crear_asistencia():
    correo = request.json['correo']
    evento_id = request.json['evento_id']

    with driver.session() as session:
        creado = session.write_transaction(crear_asistencia, correo, evento_id)

    if creado:
        return jsonify({'mensaje': 'La asistencia fue creada correctamente.'})
    else:
        return jsonify({'mensaje': 'Error al crear la asistencia. Asegúrate de que los datos sean correctos.'})

@app.route('/api/obtener_grupos_usuario', methods=['POST'])
def api_obtener_grupos_usuario():
    data = request.json
    correo = data.get('correo')
    with driver.session() as session:
        grupos = session.write_transaction(obtener_grupos_usuario, correo)
    grupos_json = []
    for grupo in grupos:
        grupo_json = {
            "id": grupo['id'],
            "nombre": grupo['nombre'],
            "descripcion": grupo['descripcion'],
            "fecha_creacion": grupo['fecha_creacion'].isoformat(),
            "privacidad": grupo['privacidad']
        }
        grupos_json.append(grupo_json)
    return jsonify(grupos_json)

def obtener_grupos_usuario(tx, correo):
    result = tx.run("MATCH (u:Usuario {correo_electronico:$correo})-[r:PARTICIPA]->(e:Grupo) RETURN e", correo=correo)
    return [record["e"] for record in result]

@app.route('/api/participaciones/crear', methods=['POST'])
def api_crear_participacion():
    correo_electronico = request.json['correo_electronico']
    grupo_id = request.json['grupo_id']

    with driver.session() as session:
        result = session.write_transaction(crear_participacion, correo_electronico, grupo_id)

    if result:
        return jsonify({'mensaje': 'Participación creada exitosamente'})
    else:
        return jsonify({'mensaje': 'Error al crear la participación'})

if __name__ == '__main__':
    app.run(debug=True)
