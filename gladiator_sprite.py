from PIL import Image, ImageDraw

# Создаем холст для спрайта: 4 кадра по 64x64 пикселя каждый
frame_width = 64
frame_height = 64
num_frames = 4
sprite_width = frame_width * num_frames
sprite_height = frame_height

# Создаем изображение с прозрачным фоном
sprite = Image.new('RGBA', (sprite_width, sprite_height), (0, 0, 0, 0))
draw = ImageDraw.Draw(sprite)

# Цвета
skin_color = (255, 213, 170)  # телесный
armor_color = (139, 137, 137)  # серый металл
gold_color = (255, 215, 0)  # золотой
red_color = (200, 50, 50)  # красный плащ
sword_color = (192, 192, 192)  # серебристый меч
brown_color = (101, 67, 33)  # коричневый

def draw_gladiator(draw, frame_num, offset_x):
    """Рисует гладиатора в разных фазах атаки"""
    
    cx = offset_x + frame_width // 2  # центр по X для текущего кадра
    cy = frame_height - 10  # позиция ног
    
    # Позиции для анимации атаки
    if frame_num == 0:  # Подготовка к удару (меч за спиной)
        body_angle = -15
        arm_angle = -60
        sword_angle = -120
        leg_offset = 0
    elif frame_num == 1:  # Замах (меч поднят)
        body_angle = 10
        arm_angle = -120
        sword_angle = -150
        leg_offset = -3
    elif frame_num == 2:  # Удар (меч вперед)
        body_angle = 25
        arm_angle = 30
        sword_angle = 45
        leg_offset = 5
    else:  # Возврат (после удара)
        body_angle = 10
        arm_angle = 0
        sword_angle = 20
        leg_offset = 2
    
    # Рисуем ноги
    leg_color = armor_color
    # Левая нога
    draw.polygon([
        (cx - 12 + leg_offset, cy),
        (cx - 8 + leg_offset, cy),
        (cx - 6 + leg_offset, cy - 20),
        (cx - 14 + leg_offset, cy - 20)
    ], fill=leg_color)
    # Правая нога
    draw.polygon([
        (cx + 8 + leg_offset, cy),
        (cx + 12 + leg_offset, cy),
        (cx + 14 + leg_offset, cy - 20),
        (cx + 6 + leg_offset, cy - 20)
    ], fill=leg_color)
    
    # Рисуем тело (торс с броней)
    body_top = cy - 45
    draw.polygon([
        (cx - 14, cy - 20),
        (cx + 14, cy - 20),
        (cx + 10, body_top),
        (cx - 10, body_top)
    ], fill=armor_color)
    
    # Золотая отделка на броне
    draw.line([(cx - 8, body_top + 5), (cx - 8, cy - 25)], fill=gold_color, width=2)
    draw.line([(cx + 8, body_top + 5), (cx + 8, cy - 25)], fill=gold_color, width=2)
    
    # Рисуем голову
    head_y = body_top - 12
    draw.ellipse([(cx - 10, head_y), (cx + 10, head_y + 22)], fill=skin_color)
    
    # Шлем
    draw.arc([(cx - 12, head_y - 5), (cx + 12, head_y + 15)], 0, 180, fill=armor_color, width=4)
    draw.line([(cx - 12, head_y + 8), (cx + 12, head_y + 8)], fill=armor_color, width=3)
    # Перья на шлеме (красные)
    draw.line([(cx, head_y - 8), (cx + 5, head_y - 18)], fill=red_color, width=3)
    draw.line([(cx + 3, head_y - 6), (cx + 10, head_y - 14)], fill=red_color, width=2)
    
    # Рисуем руку с мечом
    shoulder_x = cx + 12
    shoulder_y = body_top + 5
    
    # Предплечье и плечо
    import math
    arm_rad = math.radians(arm_angle)
    elbow_x = shoulder_x + int(12 * math.cos(arm_rad))
    elbow_y = shoulder_y + int(12 * math.sin(arm_rad))
    hand_x = elbow_x + int(10 * math.cos(arm_rad))
    hand_y = elbow_y + int(10 * math.sin(arm_rad))
    
    # Плечо
    draw.line([(shoulder_x, shoulder_y), (elbow_x, elbow_y)], fill=skin_color, width=8)
    # Предплечье
    draw.line([(elbow_x, elbow_y), (hand_x, hand_y)], fill=skin_color, width=6)
    
    # Рисуем меч
    sword_rad = math.radians(sword_angle)
    sword_length = 35
    tip_x = hand_x + int(sword_length * math.cos(sword_rad))
    tip_y = hand_y + int(sword_length * math.sin(sword_rad))
    
    # Рукоять меча
    draw.line([(hand_x, hand_y), (hand_x + int(8 * math.cos(sword_rad)), hand_y + int(8 * math.sin(sword_rad)))], 
              fill=brown_color, width=4)
    # Лезвие меча
    draw.line([(hand_x + int(8 * math.cos(sword_rad)), hand_y + int(8 * math.sin(sword_rad))), 
               (tip_x, tip_y)], fill=sword_color, width=3)
    
    # Рисуем щит на другой руке
    shield_x = cx - 18
    shield_y = body_top + 10
    draw.ellipse([(shield_x - 10, shield_y - 12), (shield_x + 8, shield_y + 12)], fill=armor_color)
    draw.ellipse([(shield_x - 8, shield_y - 10), (shield_x + 6, shield_y + 10)], fill=gold_color)
    
    # Плащ (развивается при движении)
    cape_offset = frame_num * 2
    draw.polygon([
        (cx - 8, body_top + 5),
        (cx + 8, body_top + 5),
        (cx + 15 + cape_offset, body_top + 30),
        (cx - 15 + cape_offset, body_top + 30)
    ], fill=red_color)

# Рисуем все 4 кадра
for frame in range(num_frames):
    offset_x = frame * frame_width
    draw_gladiator(draw, frame, offset_x)

# Сохраняем спрайт
sprite.save('/workspace/gladiator_attack_sprite.png')
print("Спрайт сохранен как gladiator_attack_sprite.png")

# Также создадим GIF анимацию
frames = []
for frame in range(num_frames):
    frame_img = Image.new('RGBA', (frame_width, frame_height), (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame_img)
    draw_gladiator(frame_draw, frame, 0)
    frames.append(frame_img)

frames[0].save('/workspace/gladiator_attack.gif', 
               save_all=True, 
               append_images=frames[1:], 
               duration=150, 
               loop=0)
print("GIF анимация сохранена как gladiator_attack.gif")
