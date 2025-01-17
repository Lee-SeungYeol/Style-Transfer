import torch
import torchvision.transforms as transforms
import cv2
import os
import numpy as np
import matplotlib.pyplot as plt

from models.vgg19 import Vgg19
from utils.load_image import load_style_image,load_source_image
from utils.load_model import load_vgg19
from utils.utils import gram_matrix

device=torch.device('cuda' if torch.cuda.is_available() else 'cpu')
vgg19, content_feature_maps_index_name, style_feature_maps_indices_names = load_vgg19()
vgg19.to(device)
vgg19.eval()

style_PATH='./style-image'
transform=transforms.Compose([
    transforms.ToTensor()
])


def run(style_img_value,style_power=100000):
    style_img=load_style_image(PATH=style_PATH,select_style_image=style_img_value,image_shape=(256,256))
    source_image=load_source_image(PATH="./uploads",image_shape=(256,256))
    style_img,source_image=transform(style_img),transform(source_image)

    init_resource_image=source_image.clone().detach().to(device).unsqueeze(0).requires_grad_(True)
    content_img_set_of_feature_maps=vgg19(init_resource_image)
    style_img_set_of_feature_maps = vgg19(style_img.to(device).unsqueeze(0))
    target_content_representation=content_img_set_of_feature_maps[content_feature_maps_index_name[0]].squeeze(0)

    target_style_representation = [gram_matrix(x) for cnt, x in enumerate(style_img_set_of_feature_maps) if cnt in style_feature_maps_indices_names[0]]
    target_representations = [target_content_representation, target_style_representation]
    #init_resource_image=source_image.clone().detach().to(device).unsqueeze(0).requires_grad_(True)
    epochs=100
    optimizer=torch.optim.Adam([init_resource_image],lr=0.03)
    cnt=0


    best_loss=1e+9
    for _ in range(epochs):
        optimizer.zero_grad()
        target_style_representation = target_representations[1]
        
        current_set_of_feature_maps=vgg19(init_resource_image)
   
        style_loss=0.0
        current_style_representation = [gram_matrix(x) for cnt, x in enumerate(current_set_of_feature_maps) if cnt in style_feature_maps_indices_names[0]]
        for gram_gt, gram_hat in zip(target_style_representation, current_style_representation): # 5개
            style_loss += torch.nn.MSELoss(reduction='sum')(gram_gt[0], gram_hat[0])
            
        style_loss /= len(target_style_representation) # 스타일 loss 계산
        total_loss =  (style_loss*style_power)#+(tv_loss*1.0)

        total_loss.backward()
        optimizer.step()
        if best_loss > total_loss:
            best_loss=total_loss
            cnt=0
        else:
            cnt=1
        if cnt==10:
            break

    return init_resource_image


def main(style_power=100000):
    output_image=run(style_img_value=8,style_power=style_power)
    image=output_image.squeeze(0).permute(1,2,0).cpu().detach().numpy()
    image=cv2.cvtColor(image,cv2.COLOR_RGB2BGR)
    cv2.imwrite('./outputs/result.jpg',np.clip(image*255,0,255).astype(np.uint8))
    
