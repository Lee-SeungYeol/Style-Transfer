from models.vgg19 import Vgg19


def load_vgg19():
    vgg19=Vgg19(requires_grad=False,show_progress=True)
    content_feature_maps_index = vgg19.content_feature_maps_index
    style_feature_maps_indices = vgg19.style_feature_maps_indices
    layer_names = vgg19.layer_names
    content_fms_index_name = (content_feature_maps_index, layer_names[content_feature_maps_index])
    #(4, 'conv4_2')
    style_fms_indices_names = (style_feature_maps_indices, layer_names)
    #([0, 1, 2, 3, 5],
    # ['relu1_1', 'relu2_1', 'relu3_1', 'relu4_1', 'conv4_2', 'relu5_1'])
    return vgg19.eval(), content_fms_index_name, style_fms_indices_names