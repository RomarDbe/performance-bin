# Generated by Django 4.1 on 2022-12-08 03:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendance',
            name='type',
            field=models.CharField(choices=[('ONSITE', 'Onsite'), ('OFFSITE', 'Offsite')], default='OFFSITE', max_length=20),
        ),
    ]
