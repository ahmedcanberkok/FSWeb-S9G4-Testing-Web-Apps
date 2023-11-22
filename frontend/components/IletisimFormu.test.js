import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu />);

});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />);
    const h1 = screen.getByRole("heading");
    const h1Text = screen.getByText(/İletişim Formu/i);

    expect(h1).toBeInTheDocument();
    expect(h1Text).toBeInTheDocument();


});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />);
    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, "Canberk");
    await waitFor(() => {
        expect(screen.queryAllByTestId("error").length).toBe(1);
    
        expect(
          screen.getByText("Hata: ad en az 5 karakter olmalıdır.")
        ).toBeInTheDocument();
      });
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);
    const button = screen.getByRole("button");

    userEvent.click(button);
  
    const tumHatalar = screen.getAllByTestId("error");
  
    await waitFor(() => {
      expect(tumHatalar.length).toBe(3);
    });
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);

    const adInput = screen.getByLabelText("Ad*");
  
    const soyadInput = screen.getByPlaceholderText("Mansız");
    const button = screen.getByText("Gönder");
  
    userEvent.type(adInput, "Canberk");
  
    userEvent.type(soyadInput, "Ok");
  
    userEvent.click(button);
  
    await waitFor(() => {
      expect(screen.getAllByTestId("error").length).toBe(1);
    });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu />);

    const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  
    userEvent.type(emailInput, "asdasdasdasd");
  
    const errorElement3 = screen.getByText(
      "Hata: email geçerli bir email adresi olmalıdır."
    );
  
    expect(errorElement3).toBeInTheDocument();
 
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />);

    const adInput = screen.getByPlaceholderText("İlhan");
    const emailInput = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
    const button = screen.getByText("Gönder");
  
    userEvent.type(adInput, "sdasdsads");
    userEvent.type(emailInput, "canberkok@gmail.com");
    userEvent.click(button);
  
    const errorElement2 = screen.getByText("Hata: soyad gereklidir.");
  
    await waitFor(() => {
      expect(errorElement2).toBeInTheDocument();
    });
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    const { getByLabelText, getByText, queryAllByTestId } = render(
        <IletisimFormu />
      );
    
      userEvent.type(getByLabelText("Ad*"), "Canberk");
      userEvent.type(getByLabelText("Soyad*"), "Ok");
      userEvent.type(getByLabelText("Email*"), "canberkok@gmail.com");
    
      userEvent.click(getByText("Gönder"));
    
      await waitFor(() => {
        expect(screen.getByTestId("firstnameDisplay").textContent).toBe(
          "Ad: Canberk"
        );
        expect(screen.getByTestId("lastnameDisplay").textContent).toBe(
          "Soyad: Ok"
        );
        expect(screen.getByTestId("emailDisplay").textContent).toBe(
          "Email: canberkok@gmail.com"
        );
        expect(queryAllByTestId("error").length).toBe(0);
      });
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    const { getByLabelText, getByText } = render(<IletisimFormu />);

    userEvent.type(getByLabelText("Ad*"), "Canberk");
    userEvent.type(getByLabelText("Soyad*"), "Ok");
    userEvent.type(getByLabelText("Email*"), "canberkok@gmail.com");
    userEvent.type(getByLabelText("Mesaj"), "hello");
  
    userEvent.click(getByText("Gönder"));
    await waitFor(() => {
      expect(screen.getByTestId("firstnameDisplay").textContent).toBe(
        "Ad: Canberk"
      );
      expect(screen.getByTestId("lastnameDisplay").textContent).toBe(
        "Soyad: Ok"
      );
      expect(screen.getByTestId("emailDisplay").textContent).toBe(
        "Email: canberkok@gmail.com"
      );
      expect(screen.getByTestId("messageDisplay").textContent).toBe(
        "Mesaj: Hi"
      );
      expect(screen.queryAllByTestId("error").length).toBe(0);
    });
});
