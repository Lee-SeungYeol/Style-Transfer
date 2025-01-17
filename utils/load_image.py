import os
import cv2

def load_style_image(PATH,select_style_image,image_shape):
    style_image=os.listdir(PATH)
    img=cv2.imread(PATH+'/'+style_image[select_style_image])
    img=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    img=cv2.resize(img,image_shape)
    return img

def load_source_image(PATH,image_shape):
    resource_image=os.listdir(PATH)
    img=cv2.imread(PATH+'/'+resource_image[0])
    img=cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
    img=cv2.resize(img,image_shape)
    return img



