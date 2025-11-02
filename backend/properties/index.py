import json
import os
import uuid
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления объектами недвижимости
    Args: event с httpMethod (GET, POST, PUT, DELETE), queryStringParameters, body
    Returns: HTTP response с данными объектов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
            property_id = event.get('queryStringParameters', {}).get('id')
            broker_id = event.get('queryStringParameters', {}).get('brokerId')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if property_id:
                    cur.execute("SELECT * FROM properties WHERE id = %s", (property_id,))
                    prop = cur.fetchone()
                    if not prop:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'Property not found'}),
                            'isBase64Encoded': False
                        }
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(dict(prop), default=str),
                        'isBase64Encoded': False
                    }
                elif broker_id:
                    cur.execute("SELECT * FROM properties WHERE broker_id = %s ORDER BY created_at DESC", (broker_id,))
                    props = cur.fetchall()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps([dict(p) for p in props], default=str),
                        'isBase64Encoded': False
                    }
                else:
                    cur.execute("SELECT * FROM properties WHERE status = 'active' ORDER BY created_at DESC LIMIT 100")
                    props = cur.fetchall()
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps([dict(p) for p in props], default=str),
                        'isBase64Encoded': False
                    }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            property_id = str(uuid.uuid4())
            
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO properties (
                        id, broker_id, title, description, property_type, status,
                        location_city, location_district, location_address, location_metro, location_metro_distance,
                        pricing_total_price, pricing_price_per_meter, pricing_min_investment, pricing_currency,
                        financing_method, financing_mortgage_rate, financing_down_payment,
                        investment_strategies, investment_expected_return, investment_term, 
                        investment_risk_level, investment_target_investment,
                        details_area, details_rooms, details_floor, details_total_floors,
                        media_images
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s,
                        %s, %s, %s,
                        %s, %s, %s, %s, %s,
                        %s, %s, %s, %s,
                        %s
                    )
                """, (
                    property_id,
                    body_data['brokerId'],
                    body_data['title'],
                    body_data['description'],
                    body_data['propertyType'],
                    body_data.get('status', 'draft'),
                    body_data['location']['city'],
                    body_data['location'].get('district'),
                    body_data['location']['address'],
                    body_data['location'].get('metro'),
                    body_data['location'].get('metroDistance'),
                    body_data['pricing']['totalPrice'],
                    body_data['pricing'].get('pricePerMeter'),
                    body_data['pricing']['minInvestment'],
                    body_data['pricing'].get('currency', 'RUB'),
                    body_data['financing']['method'],
                    body_data['financing'].get('mortgageRate'),
                    body_data['financing'].get('downPayment'),
                    json.dumps(body_data['investment']['strategy']),
                    body_data['investment']['expectedReturn'],
                    body_data['investment']['term'],
                    body_data['investment']['riskLevel'],
                    body_data['investment']['targetInvestment'],
                    body_data['details'].get('area'),
                    body_data['details'].get('rooms'),
                    body_data['details'].get('floor'),
                    body_data['details'].get('totalFloors'),
                    json.dumps(body_data.get('media', {}).get('images', []))
                ))
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM properties WHERE id = %s", (property_id,))
                prop = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(prop), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            property_id = body_data.get('id')
            
            if not property_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Property ID required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE properties 
                    SET title = %s, description = %s, status = %s,
                        pricing_total_price = %s, pricing_min_investment = %s,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (
                    body_data['title'],
                    body_data['description'],
                    body_data['status'],
                    body_data['pricing']['totalPrice'],
                    body_data['pricing']['minInvestment'],
                    property_id
                ))
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("SELECT * FROM properties WHERE id = %s", (property_id,))
                prop = cur.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(prop), default=str),
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
