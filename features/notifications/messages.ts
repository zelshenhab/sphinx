import type {Language} from '@/features/i18n';

export type MessageKey='cart_added'|'cart_removed'|'product_created'|'product_deleted'|'product_duplicated'|'settings_saved'|'order_copied'|'order_downloaded'|'required_fields'|'storage_error'|'download_error'|'clipboard_error'|'unexpected_error';

const messages:Record<MessageKey,Record<Language,string>>={
  cart_added:{ru:'Товар добавлен в корзину',en:'Product added to cart'},
  cart_removed:{ru:'Товар удалён из корзины',en:'Product removed from cart'},
  product_created:{ru:'Товар успешно создан и сохранён',en:'Product created and saved successfully'},
  product_deleted:{ru:'Товар удалён',en:'Product deleted'},
  product_duplicated:{ru:'Копия товара создана',en:'Product copy created'},
  settings_saved:{ru:'Настройки успешно сохранены',en:'Settings saved successfully'},
  order_copied:{ru:'Данные заказа скопированы',en:'Order details copied'},
  order_downloaded:{ru:'Карточка заказа скачана',en:'Order card downloaded'},
  required_fields:{ru:'Заполните обязательные поля',en:'Please complete the required fields'},
  storage_error:{ru:'Не удалось сохранить данные в браузере',en:'Could not save data in the browser'},
  download_error:{ru:'Не удалось скачать карточку заказа',en:'Could not download the order card'},
  clipboard_error:{ru:'Не удалось скопировать заказ',en:'Could not copy the order'},
  unexpected_error:{ru:'Произошла ошибка. Попробуйте ещё раз',en:'Something went wrong. Please try again'},
};

export function getMessage(key:MessageKey,language:Language){return messages[key][language]}
