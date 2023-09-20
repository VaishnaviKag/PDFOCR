import os
import json
import flask
from datetime import datetime
import pdf2image
import pytesseract
from pytesseract import Output
import mysql.connector as conn
import string


mydb = conn.connect(host="localhost", user="root",
                    passwd="testtest", database="OCRDatabase")
cursor = mydb.cursor()

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    data = {}
    data['message'] = 'success api'
    json_data = json.dumps(data)
    return json_data


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route('/UploadFile', methods=['POST'])
def UploadFile():
    resData = {}
    try:
        today = datetime.now()
        name_prefix = today.strftime("%d%m%Y%H%M%S")
        receivedFile = flask.request.files['file']
        formData = flask.request.form
        name, ext = os.path.splitext(receivedFile.filename)

        if (ext.lower() == '.pdf'):
            f = os.path.join(formData['temp_folder_path'],
                             name_prefix+'_' + receivedFile.filename)
            receivedFile.save(f)
            receivedFile.stream.close()
            args = [receivedFile.filename, 'stored-file/' +
                    name_prefix+'_' + receivedFile.filename]
            result_args = cursor.callproc('insert_ocr_document', args)
            args1 = [0]
            result = cursor.callproc('GetMaxDocumentId', args1)
            docId = result[0]
            mydb.commit()

            data = Fun_OCRData(f, formData['temp_folder_path'], docId)

            resData['result'] = True
            resData['message'] = 'File Uploaded.'
            json_data = json.dumps(resData)
            return json_data

        else:
            resData['result'] = False
            resData['message'] = 'Invalid File'
            json_data = json.dumps(resData)
            return json_data
    except Exception as e:
        resData['result'] = False
        resData['message'] = str(e)
        args = [str(e)]
        result_args = cursor.callproc('insert_error', args)
        mydb.commit()
        json_data = json.dumps(resData)
        return json_data


def Fun_OCRData(path, oPath, docId):
    data = []
    item = {}
    try:
        images = pdf2image.convert_from_path(path)
    except Exception as ee:
        print(ee)
    for i, img in enumerate(images):
        try:
            item = {}
            ocr_dict = pytesseract.image_to_data(
                img, lang='eng', output_type=Output.DICT)
            item['PageNo'] = i+1
            item['TextData'] = {}
            y = []
            num_words = len(ocr_dict['text'])
            for words in range(num_words):
                z = {}

                word = ocr_dict['text'][words]
                if word:
                    left = ocr_dict['left'][words]
                    right = left + ocr_dict['width'][words]
                    top = ocr_dict['top'][words]
                    bottom = top + ocr_dict['height'][words]
                    z['text'] = word
                    z['B_Box'] = ("{} {} {} {}".format(
                        left, right, top, bottom))
                    y.append(z)

            item['TextData'] = y
            data.append(item)

            args = [docId, item['PageNo'], str(item['TextData'])]
            result_args = cursor.callproc('insert_ocr_data', args)
            mydb.commit()

        except Exception as ex:
            args = [str(ex)]
            result_args = cursor.callproc('insert_error', args)
            mydb.commit()

    # os.remove(path)
    return data


@app.route('/GetAllFiles', methods=['GET'])
def GetAllFiles():
    resData = {}
    item = {}
    items = []
    try:
        cursor.callproc('get_all_files')
        for result in cursor.stored_results():
            data = result.fetchall()

        for d in data:
            item = {}
            item['Id'] = d[0]
            item['Name'] = d[1]
            item['Path'] = d[2]
            items.append(item)

        mydb.commit()
        resData['result'] = True
        resData['data'] = items
        json_data = json.dumps(resData)
        return json_data
    except Exception as e:
        resData['result'] = False
        resData['message'] = str(e)
        args = [str(e)]
        result_args = cursor.callproc('insert_error', args)
        mydb.commit()
        json_data = json.dumps(resData)
        return json_data


@app.route('/SearchWord', methods=['POST'])
def SearchWord():
    resData = {}
    formData = flask.request.form

    data2 = []
    item = {}
    # data=call prcedure n search logic

    p = formData['filepath']
    args = [p]
    w = formData['word']
    cursor.callproc('get_search_data', args)
    for result in cursor.stored_results():
        data = result.fetchall()
    for page in data:
        json_object = json.loads(page[1].replace("'", '"'))
        for text_bbox in json_object:
            if (text_bbox['text'].lower()) == w.lower():
                item = {}
                item['PageNo'] = page[0]
                item['Text'] = text_bbox['text']
                item['Box'] = text_bbox['B_Box']
                data2.append(item)
    print(data2)

    resData['result'] = True
    resData['data'] = data2
    json_data = json.dumps(resData)
    return json_data


app.run(host='127.0.0.1', port=5004)
