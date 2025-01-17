import os
from flask import Flask, request, render_template, send_from_directory
from base import *  # main 함수가 정의되어 있다고 가정
from datetime import datetime

app = Flask(__name__)
UPLOAD_FOLDER = './uploads'
OUTPUT_FOLDER = './outputs'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@app.route('/')
def index():
    # 기본 페이지 렌더링
    return render_template('test.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return render_template('test.html', error="이미지를 선택하세요!")
    
    file = request.files['image']
    if file.filename == '':
        return render_template('test.html', error="파일 이름이 비어 있습니다!")

    if file:
        # 업로드된 파일 저장
        #filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save("./uploads/input.jpg")

        # main 함수 실행 (이미지를 처리하고 항상 result.jpg로 저장)
        main()  # main 함수가 outputs/result.jpg로 저장하는 구조여야 함

        # 현재 시간(밀리초 포함)을 쿼리 문자열로 추가
        #timestamp = datetime.now().strftime('%Y%m%d%H%M%S%f')

        # HTML로 전달: 처리된 이미지 표시 (쿼리 문자열 추가)
        return render_template('test.html', image_url=f'/outputs/result.jpg', success="이미지가 처리되었습니다!")


@app.route('/outputs/<filename>')
def serve_output(filename):
    # outputs 디렉토리에서 결과 이미지 서빙
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)


if __name__ == '__main__':
    app.run(debug=True)