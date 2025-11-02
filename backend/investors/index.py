import json
import os
import uuid
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления инвесторами и воронкой продаж
    Args: event с httpMethod (GET, POST, PUT), queryStringParameters, body
    Returns: HTTP response с данными инвесторов
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
            investor_id = event.get('queryStringParameters', {}).get('id')
            broker_id = event.get('queryStringParameters', {}).get('brokerId')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if investor_id:
                    cur.execute("SELECT * FROM investors WHERE id = %s", (investor_id,))
                    investor = cur.fetchone()
                    if not investor:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Investor not found'}),
                            'isBase64Encoded': False
                        }
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(dict(investor), default=str),
                        'isBase64Encoded': False
                    }
                elif broker_id:
                    cur.execute("SELECT * FROM investors WHERE broker_id = %s ORDER BY created_at DESC", (broker_id,))
                    investors = cur.fetchall()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps([dict(i) for i in investors], default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Broker ID required'}),
                        'isBase64Encoded': False
                    }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            investor_id = str(uuid.uuid4())
            
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO investors (
                        id, broker_id, first_name, last_name, email, phone,
                        stage, profile_budget, profile_strategies, profile_risk_tolerance,
                        profile_preferred_property_types, profile_preferred_locations,
                        interaction_source, interaction_notes, timeline
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s,
                        %s, %s,
                        %s, %s, %s
                    )
                """, (
                    investor_id,
                    body_data['brokerId'],
                    body_data['personalInfo']['firstName'],
                    body_data['personalInfo']['lastName'],
                    body_data['personalInfo']['email'],
                    body_data['personalInfo']['phone'],
                    body_data.get('stage', 'lead'),
                    body_data['investmentProfile']['budget'],
                    json.dumps(body_data['investmentProfile']['strategies']),
                    body_data['investmentProfile']['riskTolerance'],
                    json.dumps(body_data['investmentProfile']['preferredPropertyTypes']),
                    json.dumps(body_data['investmentProfile']['preferredLocations']),
                    body_data['interaction']['source'],
                    body_data['interaction'].get('notes', ''),
                    json.dumps([{
                        'date': str(body_data.get('metadata', {}).get('createdAt', '')),
                        'action': 'Создан лид',
                        'details': f"Источник: {body_data['interaction']['source']}"
                    }])
                ))
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM investors WHERE id = %s", (investor_id,))
                investor = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(investor), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            investor_id = body_data.get('id')
            
            if not investor_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Investor ID required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE investors 
                    SET stage = %s, interaction_notes = %s, interaction_last_contact = CURRENT_TIMESTAMP,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (
                    body_data.get('stage'),
                    body_data.get('interaction', {}).get('notes', ''),
                    investor_id
                ))
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM investors WHERE id = %s", (investor_id,))
                investor = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(investor), default=str),
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
