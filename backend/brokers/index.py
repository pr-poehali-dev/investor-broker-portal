import json
import os
import uuid
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления брокерами
    Args: event с httpMethod (GET, POST, PUT), queryStringParameters, body
    Returns: HTTP response с данными брокера
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Broker-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    
    try:
        if method == 'GET':
            broker_id = event.get('queryStringParameters', {}).get('id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if broker_id:
                    cur.execute("SELECT * FROM brokers WHERE id = %s", (broker_id,))
                    broker = cur.fetchone()
                    if not broker:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Broker not found'}),
                            'isBase64Encoded': False
                        }
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(dict(broker), default=str),
                        'isBase64Encoded': False
                    }
                else:
                    cur.execute("SELECT * FROM brokers ORDER BY created_at DESC")
                    brokers = cur.fetchall()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps([dict(b) for b in brokers], default=str),
                        'isBase64Encoded': False
                    }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            broker_id = str(uuid.uuid4())
            referral_code = f"REF-{uuid.uuid4().hex[:8].upper()}"
            
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO brokers (id, email, first_name, last_name, phone, avatar, company, referral_code)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    broker_id,
                    body_data['email'],
                    body_data['firstName'],
                    body_data['lastName'],
                    body_data.get('phone'),
                    body_data.get('avatar'),
                    body_data.get('company'),
                    referral_code
                ))
                
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM brokers WHERE id = %s", (broker_id,))
                broker = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(broker), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            broker_id = body_data.get('id')
            
            if not broker_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Broker ID required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE brokers 
                    SET first_name = %s, last_name = %s, phone = %s, avatar = %s, company = %s, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (
                    body_data.get('firstName'),
                    body_data.get('lastName'),
                    body_data.get('phone'),
                    body_data.get('avatar'),
                    body_data.get('company'),
                    broker_id
                ))
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM brokers WHERE id = %s", (broker_id,))
                broker = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(broker), default=str),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
