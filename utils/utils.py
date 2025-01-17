import numpy as np

def gram_matrix(x):
    (b,ch,h,w)=x.size()
    features=x.view(b,ch,h*w)
    #print(features.shape)
    features_t=features.transpose(1,2) # (b,ch,h*w) -> (b,h*w,ch)
    gram=features.bmm(features_t) # (b,ch,h*w) * (b,h*w,ch) -> (b,ch,ch) #배치행렬곱    
    gram=gram/(ch*h*w)
    return gram